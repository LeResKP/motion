
from pyramid.config import Configurator
from pyramid.session import UnencryptedCookieSessionFactoryConfig
from pyramid.httpexceptions import HTTPFound

import colander
import deform

from colander import null, Invalid


class RealBoolean(colander.SchemaType):
    """Real boolean class. The passed values are python boolean True, False
    """

    def serialize(self, node, appstruct):
        if appstruct is null:
            return null

        if appstruct not in [True, False, '']:
            raise Invalid(
                node,
                '"{val}" is not a boolean'.format(val=appstruct))
        if appstruct == '':
            return False
        return appstruct

    def deserialize(self, node, cstruct):
        if cstruct is null:
            return null

        if cstruct not in [True, False, '']:
            raise Invalid(
                node,
                '"{val}" is not a boolean'.format(val=cstruct))

        if cstruct == '':
            return False
        return cstruct


def errors_to_angular(errors):
    """Make the errors understandable by angular
    """
    for key, msg in errors.iteritems():
        msg = msg.lower()
        if 'is not a number' in msg:
            errors[key] = 'number'
    return errors


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


camera_schema = CameraSchema()


class UserSchema(colander.MappingSchema):

    email = colander.SchemaNode(
        colander.String(),
        title="E-mail")

    activated = colander.SchemaNode(
        RealBoolean(),
        title="Activated",
    )

    is_admin = colander.SchemaNode(
        RealBoolean(),
        title="Admin",
    )


user_schema = UserSchema()
