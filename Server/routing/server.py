from sanic.response import text
from sanic import Sanic
from sanic.blueprints import Blueprint

host = 'localhost'
port = 8000

app = Sanic(__name__)

site = Blueprint("site", host=f"site.{host}:{port}")
api = Blueprint("api", host=f"api.{host}:{port}")
mail = Blueprint("mail", host=f"mail.{host}:{port}")


@site.route("/")
async def hello(request):
	return text("Asking /site")


@api.route("/")
async def hello(request):
	return text("Asking /api")


@mail.route("/")
async def hello(request):
	return text("Asking /mail")


app.blueprint([api, mail, site])

if __name__ == "__main__":
	app.run(host=host, port=port)
