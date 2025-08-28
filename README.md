## Deployen op Netlify

Slim Minder is direct te deployen via Netlify als Expo Web-app.

**Build command:**  
```
npx expo export:web
```

**Publish directory:**  
```
web-build
```

**Omgevingvariabelen:**  
Vul je Supabase, AI en andere secrets in via het Netlify dashboard (Settings > Environment Variables).

**Routing:**  
Zorg ervoor dat SPA-routing werkt door een `_redirects` file toe te voegen:

```
/*    /index.html   200
```

**Preview:**  
Live: [https://slim-minder.netlify.app/](https://slim-minder.netlify.app/)

---

Voor updates en foutopsporing: check het Netlify deploy log bij elke commit.
