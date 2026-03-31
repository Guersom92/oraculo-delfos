## 📛 Nombre del proyecto

**Oráculo de Delfos**

## 📝 Descripción del proyecto

Mi proyecto es una aplicación que permite que te comuniques con Apolo a traves del oráculo. EL oráculo responde las preguntas de los usuarios con profecías ambiguas y crípticas. Cuenta con rate-limit para que no se agoten mis usos de las diversas IAs. 

## 🔗 URL de la demo (desplegada en CubePath)

[https://oraculo-delfos.duckdns.org/](https://oraculo-delfos.duckdns.org/)

## 📦 URL del repositorio (público)

[https://github.com/Guersom92/oraculo-delfos](https://github.com/Guersom92/oraculo-delfos)

## 📸 Capturas de pantalla

![Screenshot de Oráculo de Delfos - Estado inicial](https://raw.githubusercontent.com/Guersom92/oraculo-delfos/refs/heads/master/frontend/public/Screenshot.png?token=GHSAT0AAAAAADYNE67TZD33P45HFXLCULEG2OMGUDQ)

![Screenshot de Oráculo de Delfos - Estado de carga](https://raw.githubusercontent.com/Guersom92/oraculo-delfos/refs/heads/master/frontend/public/Screenshot2.png?token=GHSAT0AAAAAADYNE67TKEA3CWS5PP2LOMIW2OMGV4Q)

![Screenshot de Oráculo de Delfos - Estado final](https://raw.githubusercontent.com/Guersom92/oraculo-delfos/refs/heads/master/frontend/public/Screenshot3.png?token=GHSAT0AAAAAADYNE67SLRCJBB344Q72LWZM2OMGWLA)
## ☁️ ¿Cómo has utilizado CubePath?

He desplegado el servidor backend en CubePath usando **Dokploy**, que gestiona
el servidor de **Node.js con Express** encargado de conectarse a las APIs de IA
(Groq, Cerebras y OpenRouter) para generar las profecías. El frontend, construido
con **Astro**, consume este servidor y presenta las respuestas al usuario con la
estética del oráculo. Tambien paso la respuesta de la API por chunks para mejorar la UX.

## 📧 Email de contacto

guersom80@gmail.com

## ✅ Confirmación

- ✔️ Mi proyecto está desplegado en CubePath y funciona correctamente
- ✔️ El repositorio es público y contiene un README con la documentación
- ✔️ He leído y acepto las [reglas de la hackatón](https://github.com/midudev/hackaton-cubepath-2026#-reglas)