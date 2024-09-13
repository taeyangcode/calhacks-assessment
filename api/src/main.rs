use actix_web::{web, App, HttpServer};
use firestore::{FirestoreDb, FirestoreDbOptions};

async fn signup() -> actix_web::Result<String> {
    todo!()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let _ = dotenvy::from_path("./env.dev");

    let database_project_id = dotenvy::var("FIREBASE_SERVICE_ACCOUNT_PATH").unwrap();
    let database_service_account_path = dotenvy::var("SERVICE_ACCOUNT_PATH").unwrap();
    let port = dotenvy::var("BACKEND_PORT")
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
            .app_data(web::Data::new(database.clone()))
            .route("/api/signup", web::post().to(signup))
    })
    .bind(("127.0.0.1", port))?
    .run()
    .await
}
