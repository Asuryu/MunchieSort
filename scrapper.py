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
    "mercearia/chocolate-gomas-e-rebucados/snacks-de-chocolate/",
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
import json
import matplotlib.pyplot as plt
from PIL import Image

res = {}
i = 0
flag = 0
productCount = 0

def recurse_setdefault(res, array):
    if len(array) == 0:
        return
    elif len(array) == 1:
        res.append(array[0])
    else:
        recurse_setdefault(res.setdefault(array[0], [] if len(array) == 2 else {}), array[1:])

def search_path(res, path):
    config = res
    for i in path.split("/")[:-1]:
        config = config[i]

    return config

for f in urls:
    recurse_setdefault(res, f.split("/")) 
    path = search_path(res, f)
    path.pop(0)


while(i < len(urls)):
    if(flag == 0):
        page = requests.get("https://www.continente.pt/" + urls[i] + "?start=0&srule=price-per-capacity")
    soup = BeautifulSoup(page.content, 'html.parser')
    products = soup.find_all('div', class_='product-tile')
    pageTitle = (soup.find("div", class_="search-results-title").find("h1").text)[1:-1]
    print(pageTitle.upper() + ":")

    for product in products:
        image = product.find("picture").find("img")["data-src"]
        try:
            marca = product.find("p", "ct-tile--brand").text
        except:
            marca = ""
        description = product.find("a", "ct-tile--description").text
        link = product.find("a", "ct-tile--description")["href"]
        preco = (product.find("span", "ct-tile--price-primary").find("span", "ct-price-formatted").text)[2:-1] + "€"
        try:
            preco_antigo = ((product.find("span", "ct-tile--price-dashed").text).split("\n\n")[2])[1:] + "€"
        except:
            preco_antigo = None
        quantidade = product.find("p", "ct-tile--quantity").text
        try:
            precoPorQuantidade = (product.find("div", "ct-tile--price-secondary").find("span", "ct-price-value").text)[2:-1] + "€"
            precoPorQuantidadeUnidade = (product.find("div", "ct-tile--price-secondary").find("span", "ct-m-unit").text)[1:-1]
            precoPorQuantidadeConcat = precoPorQuantidade + precoPorQuantidadeUnidade
        except:
            precoPorQuantidadeConcat = None
        print(f"{marca} - {description} - {preco}")
        objeto = {
            "marca": marca,
            "descricao": description,
            "preco": preco,
            "preco_antigo": preco_antigo,
            "quantidade": quantidade,
            "precoPorQuantidade": precoPorQuantidadeConcat,
            "link": link,
            "imagem": image
        }
        path = search_path(res, urls[i])
        path.append(objeto)
        productCount += 1

    try:
        resultsFound = soup.find("div", class_="search-results-products-counter").text
        resultsFound = [int(s) for s in resultsFound.split() if s.isdigit()]
        print(f"\n{resultsFound[0]} de {resultsFound[1]} resultados encontrados")
        page = requests.get(f"https://www.continente.pt/{urls[i]}?start={resultsFound[0]}&srule=price-per-capacity")
        flag = 1
    except:
        #print("Pesquisa finalizada")
        #input("Pressione qualquer tecla para continuar...")
        page = requests.get("https://www.continente.pt/" + urls[i] + "?start=0&srule=price-per-capacity")
        flag = 0
        i += 1


with open("items.json", "w") as f:
    json.dump(res, f, indent=4, ensure_ascii=False)

print("Fim da pesquisa")
print("Quantidade de produtos encontrados: " + str(productCount))