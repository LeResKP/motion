from sqlalchemy import (
    Boolean,
    Column,
    Index,
    Integer,
    String,
)

from .meta import Base


class Camera(Base):
    __tablename__ = 'camera'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    src = Column(String(255), nullable=False)
    host = Column(String(255), nullable=False)
    port = Column(String(255), nullable=False)
    public_url = Column(String(255), nullable=True)

    enabled = Column(Boolean, nullable=False, default=True)
    detection_enabled = Column(Boolean, nullable=False, default=False)
    upload_enabled = Column(Boolean, nullable=False, default=False)

    def get_url(self):
        if self.public_url:
            return self.public_url
        return '%s:%s' % (self.host, self.port)
