
from pyramid.config import Configurator
from pyramid.session import UnencryptedCookieSessionFactoryConfig
from pyramid.httpexceptions import HTTPFound

import colander
import deform


class CameraSchema(colander.MappingSchema):

    name = colander.SchemaNode(
        colander.String(),
        title="Name")

    src = colander.SchemaNode(
        colander.String(),
        title="Video source")

    host = colander.SchemaNode(
        colander.String(),
        title="Host")

    port = colander.SchemaNode(
        colander.Integer(),
        title="Port")

    public_url = colander.SchemaNode(
        colander.String(),
        missing=colander.drop,
        title="Public url")


camera_form = deform.form.Form(CameraSchema())
