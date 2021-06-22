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
```javascript
BASE_URL=http://localhost:3000
PORT=3000
MONGODB_URL=[YOUR MONGODB URL]
API_KEY=[YOUR API KEY]
JWT_KEY=[YOUR JWT KEY]
```
Menjadi seperti contoh ini,
```javascript
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
3. Kemudian lanjutkan untuk menginstall dan menjalankan [service email](https://github.com/ragil000/nap.email.service "service email").

### DAFTAR ENDPOINT
```javascript
=> Account
	- /account/signup
		method: POST
		body {
			"email": "string [format email]", // wajib
			"password": "string", // wajib
			"role": "string [pilih salah satu: user/superAdmin]" // tidak wajib, default "user"
		}
		header {
			"Content-Type": "application/json",
			"X-API-KEY": "[API KEY yang kamu set di service utama]"
		}
		
	- /account/signin
		method: POST
		body {
			"email": "string [format email]", // wajib
			"password": "string", // wajib
		}
		header {
			"Content-Type": "application/json",
			"X-API-KEY": "[API KEY yang kamu set di service utama]"
		}
		
	- /account
		method: GET
		params {
			"page": "integer", // tidak wajib, default 1
			"limit": "integer", // tidak wajib, default 10
			"id": "object ID" // tidak wajib, saat di set akan memberikan response detail
		}
		header {
			"Content-Type": "application/json",
			"X-API-KEY": "[API KEY yang kamu set di service utama]",
			"Authorization": "Bearer [token yang didapat dari endpoint /account/signin]"
		}
		
	- /account
		method: PUT
		params {
			"id": "object ID" // wajib
		}
		body {
			"email": "string [format email]", // wajib
			"password": "string", // wajib
			"role": "string [pilih salah satu: user/superAdmin]" // tidak wajib
		}
		header {
			"Content-Type": "application/json",
			"X-API-KEY": "[API KEY yang kamu set di service utama]",
			"Authorization": "Bearer [token yang didapat dari endpoint /account/signin]"
		}
		
	- /account
		method: DELETE
		params {
			"id": "object ID", // wajib
			"hard": "string" // tidak wajib, saat di set "yes" maka akan menghapus data dari database, jika tidak diisi data tidak hilang dalam database tapi tidak ditampilkan
		}
		header {
			"Content-Type": "application/json",
			"X-API-KEY": "[API KEY yang kamu set di service utama]",
			"Authorization": "Bearer [token yang didapat dari endpoint /account/signin]"
		}
		
=> Schedule
	- /schedule
		method: POST
		body {
			"receivers": "array", // wajib, isisnya array string berupa email atau nomor whatsapp
			"message": "string", // wajib
			"platform": "string [pilih salah satu: email/whatsapp]", // wajib
			"scheduleType": "string, [pilih salah satu: repeated/nonRepeated]", // wajib
			"hours": "integer", // wajib
			"minutes": "integer", // wajib
			"days": "string/array", // wajib, bisa string date jika scheduleType=nonRepeated dan array string jika scheduleType=repeated berisi nama hari dalam bahasa inggris
		}
		header {
			"Content-Type": "application/json",
			"X-API-KEY": "[API KEY yang kamu set di service utama]",
			"Authorization": "Bearer [token yang didapat dari endpoint /account/signin]"
		}
		
	- /schedule
		method: PUT
		params {
			"id": "object ID" // wajib
		}
		body {
			"receivers": "array", // wajib, isisnya array string berupa email atau nomor whatsapp
			"message": "string", // wajib
			"platform": "string [pilih salah satu: email/whatsapp]", // wajib
			"scheduleType": "string, [pilih salah satu: repeated/nonRepeated]", // wajib
			"hours": "integer", // wajib
			"minutes": "integer", // wajib
			"days": "string/array", // wajib, bisa string date jika scheduleType=nonRepeated dan array string jika scheduleType=repeated berisi nama hari dalam bahasa inggris
		}
		header {
			"Content-Type": "application/json",
			"X-API-KEY": "[API KEY yang kamu set di service utama]",
			"Authorization": "Bearer [token yang didapat dari endpoint /account/signin]"
		}
		
	- /schedule
		method: DELETE
		params {
			"id": "object ID", // wajib
			"hard": "string" // tidak wajib, saat di set "yes" maka akan menghapus data dari database, jika tidak diisi data tidak hilang dalam database tapi tidak ditampilkan
		}
		header {
			"Content-Type": "application/json",
			"X-API-KEY": "[API KEY yang kamu set di service utama]",
			"Authorization": "Bearer [token yang didapat dari endpoint /account/signin]"
		}
		
	- /schedule
		method: GET
		params {
			"page": "integer", // tidak wajib, default 1
			"limit": "integer", // tidak wajib, default 10
			"id": "object ID", // tidak wajib, saat di set akan memberikan response detail
			"self": "string", // tidak wajib, saat di set "yes" maka akan memfilter hanya schedule yang aktif saja yang ditampilkan
			"repeated": "string" // tidak wajib, saat di set "yes" maka akan memfilter hanya schedule yang berulang saja yang ditampilkan
		}
		header {
			"Content-Type": "application/json",
			"X-API-KEY": "[API KEY yang kamu set di service utama]",
			"Authorization": "Bearer [token yang didapat dari endpoint /account/signin]"
		}
```

### LISENSI
Anda diperbolehkan menggunakan proyek ini secara bebas, termasuk juga yang bersifat komersil (tidak termasuk template yang saya gunakan).
