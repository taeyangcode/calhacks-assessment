use actix_cors::Cors;
use actix_web::{
    http::header::ContentType,
    web::{self},
    App, HttpResponse, HttpServer,
};
use firestore::{FirestoreDb, FirestoreDbOptions};
use jsonwebtoken::{EncodingKey, Header};
use serde::{Deserialize, Serialize};
use strum::AsRefStr;

#[derive(Debug, Serialize, Deserialize, AsRefStr)]
enum DatabaseCollection {
    #[strum(serialize = "users")]
    Users,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims<'a> {
    iat: u64,
    exp: u64,
    id: &'a str,
}

#[derive(Debug, Serialize, Deserialize)]
struct User {
    pub email: String,
    pub password: String,
    pub id: Option<String>,
    pub full_name: Option<String>,
    pub university: Option<String>,
    pub major: Option<String>,
    pub graduation_date: Option<u64>,
    pub github: Option<String>,
}

impl User {
    const WEEK_IN_SECONDS: u64 = 604_800;

    pub fn encode(&self) -> jsonwebtoken::errors::Result<String> {
        let current_timestamp: u64 = jsonwebtoken::get_current_timestamp();

        let claims = Claims {
            iat: current_timestamp,
            exp: current_timestamp + User::WEEK_IN_SECONDS,
            id: self.id.as_ref().unwrap(),
        };

        let jwt_secret = dotenvy::var("JWT_SECRET").unwrap();

        jsonwebtoken::encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(jwt_secret.as_bytes()),
        )
    }
}

async fn signup(database: web::Data<FirestoreDb>, body: web::Json<User>) -> actix_web::Result<actix_web::HttpResponse> {
    let mut signup_user = body.0;

    if signup_user.email.len() == 0 || signup_user.password.len() == 0 {
        return Ok(HttpResponse::UnprocessableEntity()
            .insert_header(ContentType::html())
            .finish());
    }

    let user_collection = match database
        .fluent()
        .select()
        .from(DatabaseCollection::Users.as_ref())
        .obj::<User>()
        .query()
        .await
    {
        Ok(users) => users,
        Err(_) => return Ok(HttpResponse::InternalServerError().finish()),
    };

    let user_already_exists = user_collection
        .into_iter()
        .any(|registered| registered.email == signup_user.email);

    if user_already_exists {
        return Ok(HttpResponse::Conflict().finish());
    }

    signup_user.id = Some(uuid::Uuid::new_v4().to_string());

    let _ = match database
        .fluent()
        .insert()
        .into(DatabaseCollection::Users.as_ref())
        .document_id(signup_user.id.as_ref().unwrap())
        .object(&signup_user)
        .execute::<User>()
        .await
    {
        Err(_) => return Ok(HttpResponse::InternalServerError().finish()),
        _ => (),
    };

    let token = match signup_user.encode() {
        Ok(token) => token,
        Err(_) => return Ok(HttpResponse::InternalServerError().finish()),
    };

    Ok(HttpResponse::Ok()
        .content_type(ContentType::json())
        .insert_header(("Location", format!("/badges/{}", signup_user.id.unwrap())))
        .json(token))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let _ = dotenvy::from_path("./.env");

    let database_project_id = dotenvy::var("FIRESTORE_PROJECT_ID").unwrap();
    let database_service_account_path = dotenvy::var("FIREBASE_SERVICE_ACCOUNT_PATH").unwrap();
    let backend_port = dotenvy::var("BACKEND_PORT")
        .unwrap()
        .parse::<u16>()
        .unwrap();

    let database = FirestoreDb::with_options_service_account_key_file(
        FirestoreDbOptions::new(database_project_id),
        database_service_account_path.into(),
    )
    .await
    .unwrap();

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(database.clone()))
            .route("/api/signup", web::post().to(signup))
    })
    .bind(("127.0.0.1", backend_port))?
    .run()
    .await
}
