# 🚀 Simple Web Scraping with Puppeteer / JavaScript

## Summary
- [📖 About](#-About)
- [💾 Technologies and resources used](#-Technologies-and-resources-used)
- [📁 Clone the project](#-Clone-the-project)
- [🚧 Project](#-Project)

<br>

---

<br>

## 📖 About

Simple project to learn about web scraping.

<br>

---

<br>

## 💾 Technologies and resources used

- HTML, CSS, JavaScript
  - [Puppeteer](https://pptr.dev/)
- NodeJS
    - [Express](https://expressjs.com/pt-br/api.html)
    - [HBS](https://handlebarsjs.com/)

<br>

---

<br>

## 📁 Clone the project

```bash
$ git clone https://github.com/LanPRD/web-scraping.git

$ cd web-scraping
```

```bash
$ npm install
$ npm start
```
or
```bash
$ yarn install
$ yarn start
```

<br>

---

<br>

## 🚧 Project
## Scripts

### Run the puppeteer
```bash
$ npm run pup
```
or
```bash
$ yarn pup
```

<br>

### Run the express
```bash
$ npm start
```
or
```bash
$ yarn start
```

<br>

### Change default constants and functions

You can change URL on the line 66.
```javascript
const url =
    baseUrl +
    brandFilter.join("--") +
    "." +
    "_" +
    colorFilter.join("_") +
    sizeFilterString +
    segmentFilter;
```
The current URL in the project will only work in this example.

<br>

Other place needs be changed is this function at line 135. <br>
You can use the code as an example to make you project.

```javascript
const getAllItems = async (page) => {}
```

<br>

---

<br>

<h6 align="center" font-size="12">Developed by <strong>Allan Prado</strong></h6>
