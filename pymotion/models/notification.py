from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Text,
)

from sqlalchemy.orm import relationship

from .meta import Base


class Notification(Base):
    __tablename__ = 'notification'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    subscription = Column(Text, nullable=True, default=None)

    user = relationship('User', back_populates='notification', uselist=False)
