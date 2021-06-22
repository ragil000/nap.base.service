<img alt="NodeJS" src="https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node-dot-js&logoColor=white"/> <img alt="Express.js" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/> <img alt="MongoDB" src ="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"/>
### TENTANG
Ini adalah salah satu service dari aplikasi penjadwalan pesan dan pengingat (notification app). Silahkan download semua servicenya untuk menjalankan aplikasi ini.

![user dashboard](https://github.com/ragil000/nap.base.service/blob/master/readme/user-dashboard.png?raw=true)
*Tampilan halaman awal user*

------------


![admin dashboard](https://github.com/ragil000/nap.base.service/blob/master/readme/admin-dashboard.png?raw=true)
*Tampilan halaman awal admin*

------------

### INSTALASI
1. Proyek ini menggunakan *nodejs* dan *expressjs*  [Download dan install disini](https://nodejs.org/en/ "Download dan install disini")
2. Ubah nama file `dotenv` menjadi `.env`, kemudian ubah isinya.
Dari ini,
    ```json
BASE_URL=http://localhost:3000
PORT=3000
MONGODB_URL=[YOUR MONGODB URL]
API_KEY=[YOUR API KEY]
JWT_KEY=[YOUR JWT KEY]
```
Menjadi seperti contoh ini,
    ```json
BASE_URL=http://localhost:3000
PORT=3000
MONGODB_URL=mongodb://127.0.0.1:27017/nap
API_KEY=tukang-ngoding
JWT_KEY=penyihir-jahat
```
3. Lalu gunakan perintah ini `npm install` di terminal untuk menginstall seluruh *dependencies* yang diperlukan.
4. Proyek ini menggunakan *database* mongoDB, jangan lupa install mongoDB [Download dan instsall disini](https://docs.mongodb.com/manual/installation/ "Download dan instsall disini")

### MENJALANKAN
1. Sebaiknya menggunakan *nodemon* untuk menjalankan service ini. Install *nodemon* menggunakan perintah `npm install -g nodemon`.
2. Kemudian jalankan service ini menggunakan perintah `nodemon server`.
3. Kemudian lanjutkan untuk menginstall dan menjalankan [service email](https://github.com/ragil000/nap.email.service "service email"), [service whatsapp](https://github.com/ragil000/nap.wa.service "service whatsapp") dan [service frontend](https://github.com/ragil000/nap.front.service "service frontend").

### LISENSI
Anda diperbolehkan menggunakan proyek ini secara bebas, termasuk juga yang bersifat komersil (tidak termasuk template yang saya gunakan).