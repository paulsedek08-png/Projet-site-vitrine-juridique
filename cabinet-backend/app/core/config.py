from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Cabinet Juridique API"
    app_version: str = "1.0.0"

    database_url: str = "sqlite:///./juju.db"

    secret_key: str = "CHANGE_ME_IN_PRODUCTION"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()