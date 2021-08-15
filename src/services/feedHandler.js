const axios = require('axios');
const fs = require('fs');
const path = require("path");
const Twig = require('twig');
const parseString = require('xml2js').parseString;
const inlineCss = require('inline-css');

const dataGet = (object, path, defaultValue = null) => {
  let pathLevel = path.split('.');
  let currentObject = object;
  for(let i = 0; i < pathLevel.length; i++) {
    if(currentObject[pathLevel[i]]) {
      currentObject = currentObject[pathLevel[i]];
    } else {
      return defaultValue;
    }
  }
  return currentObject;
}

const requestFeedBody = async (url) => {
  const data = await axios({
    method: 'get',
    url: url,
  });
  let body = data.data;
  body = body.replace(/ & /g, ' &amp; ');
  let xmlParse = await new Promise((resolve, reject) => {
    parseString(body, function (error, result) {
      if(error) {
        reject(error);
      } else {
        resolve(result)
      }
    });
  });

  return xmlParse;
}

const requestFeedBodyTest = async (url) => {
  let res = await axios({
    method: 'get',
    url: url,
  });

  return res.data;
}

const renderArticle = (data) => {
  const templateArticleBase = fs.readFileSync(path.resolve(__dirname, '../template/article.html'), 'utf8');
  const templateProductBase = fs.readFileSync(path.resolve(__dirname, '../template/product.html'), 'utf8')
  const templateProduct = Twig.twig({
      data: templateProductBase
  });
  const templateArticle = Twig.twig({
    data: templateArticleBase
  });
  let articleHtml = '';
  for(let i = 0; i < data.length; i++) {
    let viewParams = {
      article_title: dataGet(data,`${i}.title.0`, ''),
      article_pubDate: dataGet(data,`${i}.pubDate.0`, ''),
      article_subtitle: dataGet(data,`${i}.subtitle.0`, ''),
      article_author: dataGet(data,`${i}.author.0`, ''), 
      article_introText: dataGet(data,`${i}.amzn:introText.0`, ''),
      article_content: dataGet(data,`${i}.content:encoded.0`, ''),
      article_heroImage: dataGet(data,`${i}.amzn:heroImage.0`, ''),
    }
    let baseAricleHtml = templateArticle.render(viewParams);
    let products = dataGet(data,`${i}.amzn:products.0.amzn:product`, []);
    for(let j = 0; j < products.length; j++) {
      let productUrl = dataGet(products,`${j}.amzn:productURL.0`);
      let productHtml = renderProduct(products[j], templateProduct);
      baseAricleHtml = baseAricleHtml.replace(`<div data-itemtype="product"><a href="${productUrl}"></a></div>`, productHtml);
    }
    articleHtml += `<div id="article_${i}" class="aritcle-section">` + baseAricleHtml + '</div>';
  }
  return articleHtml;
}

const renderProduct = (data, templateProduct) => {
  let viewParams = {
    product_award: data['amzn:award'][0],
    productHeadline: '',
    productSummary: data['amzn:productSummary'][0],
  }
  return templateProduct.render(viewParams);
}

const renderFeed = (data) => {
  const templateFeedBase = fs.readFileSync(path.resolve(__dirname, '../template/feed.html'), 'utf8');
  const templateFeed = Twig.twig({
      data: templateFeedBase
  });
  if(data.rss.channel[0].item) {
    let articles = renderArticle(data.rss.channel[0].item);
    return templateFeed.render({
      articles: articles
    });
  }
  return '';
}

const convertStyleToInline = async (html) => {
  let result = await new Promise((resolve, reject) => {
    inlineCss(html, {
      url: 'http://localhost:3000/'
    }).then(function (output) {
      resolve(output);
    }).catch(function (error) {
      reject(error);
    })
  });
  return result;
}

module.exports = {
  requestFeedBody: requestFeedBody,
  renderFeed: renderFeed,
  convertStyleToInline: convertStyleToInline,
  requestFeedBodyTest: requestFeedBodyTest
}