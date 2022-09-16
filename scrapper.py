from concurrent.futures import process
import requests
from bs4 import BeautifulSoup
import json
import schedule
import time

lastKnownUrl = ""

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

def get_category_name(url, index=0):
    global lastKnownUrl
    urlSplit = (url.split("/")[:-1])[0:index+1]
    url = "/".join(urlSplit)
    page = requests.get("https://www.continente.pt/" + url)
    soup = BeautifulSoup(page.content, 'html.parser')
    pageTitle = (soup.find("div", class_="search-results-title").find("h1").text)[1:-1]
    try:
        pageImage = soup.find("picture").find("img", class_="img-fluid")['src']
        lastKnownUrl = pageImage
    except:
        pageImage = lastKnownUrl
    return pageTitle, pageImage

def get_items(url):
    objs = []
    flag = 0
    global itemsCount
    while(True):
        if(flag == 0):
            page = requests.get("https://www.continente.pt/" + url + "?start=0&srule=price-per-capacity")
        soup = BeautifulSoup(page.content, 'html.parser')
        products = soup.find_all('div', class_='product-tile')
        pageTitle = (soup.find("div", class_="search-results-title").find("h1").text)[1:-1]

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
                "marca": marca.replace("\n", ""),
                "descricao": description.replace("\n", ""),
                "preco": preco.replace("\n", ""),
                "preco_antigo": preco_antigo.replace("\n", "") if preco_antigo != None else None,
                "quantidade": quantidade.replace("\n", ""),
                "precoPorQuantidade": precoPorQuantidadeConcat.replace("\n", "") if precoPorQuantidadeConcat != None else None,
                "link": link,
                "imagem": image
            }
            objs.append(objeto)
            itemsCount += 1
        try:
            resultsFound = soup.find("div", class_="search-results-products-counter").text
            resultsFound = [int(s) for s in resultsFound.split() if s.isdigit()]
            print(f"\n{resultsFound[0]} de {resultsFound[1]} resultados encontrados")
            page = requests.get(f"https://www.continente.pt/{url}?start={resultsFound[0]}&srule=price-per-capacity")
            flag = 1
        except:
            return pageTitle, objs


def create (path, dictionaryarray, url):
    headarray = dictionaryarray
    title, items = get_items(url)
    for index, element in enumerate(path):
        exists = 0
        pageName, pageImage = get_category_name(url, index)
        for head in headarray:
            if head['name'] == pageName:
                head.setdefault('items',[])
                headarray = head['items']
                exists =1
                break
        if not exists:
            if index == len(path) - 1: 
                headarray.append({'name': title, 'image_url': pageImage, "items": items})
            else:
                headarray.append({'name': pageName, 'image_url': pageImage, 'items':[]})
                headarray=headarray[-1]['items']

def job():
    global itemsCount
    itemsCount = 0
    i = 0
    res = {}
    d = []
    for i in urls:
        dict = create([j for j in i.split('/') if j != ''] ,d, i)
        data={'items': d}

    with open("items_bu.json", "w") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print("Done")

job()
schedule.every(7).days.at("00:01").do(job)

while True:
    schedule.run_pending()
    time.sleep(1)