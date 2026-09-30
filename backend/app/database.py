import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

CA_CERT_PATH = os.getenv(
    "CA_CERT_PATH",
    "certs/ca.pem"
)

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "ssl": {
            "ca": CA_CERT_PATH
        }
    },
    echo=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()