from sqlalchemy import (
    Boolean,
    Column,
    Index,
    Integer,
    String,
)

from .meta import Base


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False)
    activated = Column(Boolean, nullable=False, default=False)
    is_admin = Column(Boolean, nullable=False, default=False)


# Index('user_email_index', User.email, unique=True, mysql_length=255)
