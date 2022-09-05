urls = [
    "mercearia/cereais-e-barras/cereais-infantis-e-juvenis/",
    "mercearia/cereais-e-barras/barras-de-cereais/",
    "mercearia/bolachas-biscoitos-e-tostas/bolachas-de-chocolate/",
    "mercearia/bolachas-biscoitos-e-tostas/bolachas-com-cobertura-e-recheio/",
    "mercearia/bolachas-biscoitos-e-tostas/bolachas-infantis/",
    "mercearia/bolachas-biscoitos-e-tostas/bolachas-de-manteiga/",
    "mercearia/bolachas-biscoitos-e-tostas/maria-torrada-e-biscoitos/",
    "mercearia/bolachas-biscoitos-e-tostas/sortidos-de-bolachas/",
    "mercearia/bolachas-biscoitos-e-tostas/bolos-napolitanas-queques.../",
    "mercearia/bolachas-biscoitos-e-tostas/bolachas-e-biscoitos-salgados/",
    "mercearia/chocolate-gomas-e-rebucados/chocolates/",
    "mercearia/chocolate-gomas-e-rebucados/bombons/",
    "mercearia/chocolate-gomas-e-rebucados/snacks-de-chocolate/,"
    "mercearia/chocolate-gomas-e-rebucados/gomas-pastilhas-e-rebucados/",
    "mercearia/snacks-e-batatas-fritas/batatas-fritas/",
    "mercearia/snacks-e-batatas-fritas/aperitivos-e-snacks/",
    "mercearia/snacks-e-batatas-fritas/pipocas/",
    "refeicoes-faceis/entradas-e-salgados/salgados/",
    "refeicoes-faceis/entradas-e-salgados/panados-quiches-e-folhados/",
    "refeicoes-faceis/entradas-e-salgados/paes-de-alho-e-queijo/",
    "refeicoes-faceis/pizzas/frescas/",
    "refeicoes-faceis/sobremesas/",
    "refeicoes-faceis/hamburgueres/pronto-a-comer/",
    "refeicoes-faceis/hamburgueres/frescos/",
    "refeicoes-faceis/massas-frescas-e-noodles/noodles/",
    "congelados/pizzas/",
    "congelados/gelados/",
    "congelados/douradinhos-e-nuggets/",
    "congelados/hamburgueres-e-refeicoes/hamburgueres/"
]

from math import prod
import re
from unittest import result
import requests
from bs4 import BeautifulSoup

i = 0
flag = 0

while(True):
    if(flag == 0):
        page = requests.get("https://www.continente.pt/" + urls[i] + "?start=0&srule=price-per-capacity")
    soup = BeautifulSoup(page.content, 'html.parser')
    products = soup.find_all('div', class_='product-tile')
    pageTitle = (soup.find("div", class_="search-results-title").find("h1").text)[1:-1]
    print(pageTitle.upper() + ":")

    for product in products:
        image = product.find("picture").find("img")["data-src"]
        marca = product.find("p", "ct-tile--brand").text
        description = product.find("a", "ct-tile--description").text
        preco = product.find("span", "ct-price-formatted").text
        print(f"{marca} - {description} - {preco[2:-1]}€")

    try:
        resultsFound = soup.find("div", class_="search-results-products-counter").text
        resultsFound = [int(s) for s in resultsFound.split() if s.isdigit()]
        print(f"\n{resultsFound[0]} de {resultsFound[1]} resultados encontrados")
        page = requests.get(f"https://www.continente.pt/{urls[i]}?start={resultsFound[0]}&srule=price-per-capacity")
        flag = 1
    except:
        print("Pesquisa finalizada")
        input("Pressione qualquer tecla para continuar...")
        page = requests.get("https://www.continente.pt/" + urls[i] + "?start=0&srule=price-per-capacity")
        flag = 0
        i += 1