# 📸 Guía de Configuración - Carga de Imágenes de Perfil

## 🎯 Opciones de Configuración

Tienes 3 opciones para manejar la carga de imágenes de perfil:

### Opción 1: Cloudinary (Recomendado - Más Fácil) ⭐

**Ventajas:**
- ✅ Gratis hasta 25GB
- ✅ Sin configuración de servidor
- ✅ CDN global automático
- ✅ Transformaciones de imagen automáticas

**Pasos:**

1. **Crea una cuenta gratuita en Cloudinary:**
   - Ve a: https://cloudinary.com/users/register/free
   - Regístrate con tu email

2. **Obtén tus credenciales:**
   - Inicia sesión en: https://cloudinary.com/console
   - En el Dashboard verás tu **Cloud Name**
   - Ve a Settings → Upload
   - Crea un nuevo **Upload Preset**:
     - Click en "Add upload preset"
     - Mode: **Unsigned**
     - Folder: `profile-images` (opcional)
     - Guarda y copia el nombre del preset

3. **Configura las variables de entorno:**
   ```env
   EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
   EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
   ```

4. **¡Listo!** Ya puedes subir imágenes de perfil

---

### Opción 2: Backend Propio

Si prefieres que tu backend maneje las imágenes:

**Pasos:**

1. **Instala multer en tu backend (si usas Node.js):**
   ```bash
   npm install multer
   ```

2. **Crea el endpoint de upload:**
   ```javascript
   // backend/src/upload/upload.controller.ts
   import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
   import { FileInterceptor } from '@nestjs/platform-express';
   import { diskStorage } from 'multer';
   
   @Controller('upload')
   export class UploadController {
     @Post('profile')
     @UseInterceptors(
       FileInterceptor('file', {
         storage: diskStorage({
           destination: './uploads/profile',
           filename: (req, file, cb) => {
             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
             cb(null, `${uniqueSuffix}-${file.originalname}`);
           },
         }),
       }),
     )
     uploadFile(@UploadedFile() file: Express.Multer.File) {
       return {
         url: `${process.env.API_URL}/uploads/profile/${file.filename}`,
       };
     }
   }
   ```

3. **Modifica el helper en el frontend:**
   
   Abre: `helpers/image-upload.helper.ts`
   
   En el archivo principal donde usas el hook, cambia:
   ```typescript
   // De:
   import { uploadImageToCloudinary } from '@/helpers/image-upload.helper';
   const imageUrl = await uploadImageToCloudinary(result.assets[0].uri);
   
   // A:
   import { uploadImageToBackend } from '@/helpers/image-upload.helper';
   const token = useAuthStore.getState().token;
   const imageUrl = await uploadImageToBackend(result.assets[0].uri, token!);
   ```

---

### Opción 3: Firebase Storage

**Pasos:**

1. **Instala Firebase:**
   ```bash
   bunx expo install firebase
   ```

2. **Configura Firebase:**
   ```typescript
   // firebase.config.ts
   import { initializeApp } from 'firebase/app';
   import { getStorage } from 'firebase/storage';
   
   const firebaseConfig = {
     apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
     authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
     storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
   };
   
   const app = initializeApp(firebaseConfig);
   export const storage = getStorage(app);
   ```

3. **Crea un helper para Firebase:**
   ```typescript
   // helpers/firebase-upload.helper.ts
   import { storage } from '@/firebase.config';
   import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
   
   export const uploadImageToFirebase = async (imageUri: string): Promise<string> => {
     const response = await fetch(imageUri);
     const blob = await response.blob();
     
     const filename = `profile-${Date.now()}.jpg`;
     const storageRef = ref(storage, `profiles/${filename}`);
     
     await uploadBytes(storageRef, blob);
     const url = await getDownloadURL(storageRef);
     
     return url;
   };
   ```

---

## 🔧 Cómo Funciona el Sistema Actual

### Flujo de Carga de Imagen:

1. **Usuario toca el botón de cámara** en su foto de perfil
2. **Se muestra un modal** con opciones:
   - 📷 Tomar foto (abre la cámara)
   - 🖼️ Elegir de galería
   - ❌ Cancelar

3. **Usuario selecciona/toma una foto**
   - La imagen se recorta en formato cuadrado (1:1)
   - Se comprime con calidad 0.8

4. **Imagen se sube al servicio elegido**
   - Cloudinary / Backend / Firebase
   - Se muestra un indicador de carga

5. **Se actualiza el backend**
   - Endpoint: `PATCH /api/auth/profile/image`
   - Body: `{ "imageUrl": "https://..." }`

6. **Se actualiza la UI**
   - Store de Zustand se actualiza
   - React Query recarga el perfil
   - Usuario ve su nueva foto

---

## 📱 Permisos Requeridos

El sistema solicita automáticamente:

- ✅ **Galería**: Para seleccionar fotos existentes
- ✅ **Cámara**: Para tomar nuevas fotos

Si el usuario niega los permisos, se muestra un mensaje explicativo.

---

## 🎨 Personalización del Botón

El botón de cámara está ubicado en la esquina inferior derecha de la foto de perfil:

```typescript
// Para cambiar el color del botón:
backgroundColor: "#5D8370", // Color verde del tema

// Para cambiar el tamaño:
width: 36,
height: 36,
borderRadius: 18,

// Para cambiar el ícono:
<Ionicons name="camera" size={18} color="#fff" />
```

---

## 🐛 Resolución de Problemas

### Error: "No se pudo actualizar tu foto de perfil"

**Posibles causas:**
1. No configuraste las variables de entorno de Cloudinary
2. El backend no responde
3. No hay conexión a internet

**Solución:**
- Verifica el archivo `.env` tenga las variables correctas
- Revisa la consola de desarrollo (`bun start`)
- Verifica que el backend esté corriendo

### La imagen no se ve después de subirla

**Solución:**
- Espera unos segundos (el CDN puede tardar)
- Recarga la pantalla de perfil
- Verifica que la URL sea válida (ábrela en el navegador)

### Error: "Permisos necesarios"

**Solución:**
- En iOS: Settings → [Tu App] → Allow Camera/Photos
- En Android: Settings → Apps → [Tu App] → Permissions

---

## 📊 Límites y Recomendaciones

### Cloudinary (Plan Gratuito):
- ✅ 25 GB de almacenamiento
- ✅ 25 GB de ancho de banda/mes
- ✅ ~7,500 imágenes
- ⚠️ Marca de agua si excedes límites

### Recomendaciones:
- 📸 Comprime las imágenes (quality: 0.8 ya está configurado)
- 🔄 Elimina fotos antiguas si cambias de foto
- 📏 Mantén imágenes de perfil en ~500x500px
- 🗂️ Usa folders en Cloudinary para organizar

---

## 🔐 Seguridad

- ✅ Solo usuarios autenticados pueden subir imágenes
- ✅ El token JWT se envía en cada petición al backend
- ✅ El backend valida la autenticación antes de actualizar
- ⚠️ Cloudinary "unsigned" es seguro para imágenes públicas
- 💡 Para mayor seguridad, usa "signed uploads" en Cloudinary

---

## 📝 Próximos Pasos Opcionales

1. **Validación de tipo de archivo**
2. **Límite de tamaño de imagen**
3. **Filtros y efectos** (usando Cloudinary transformations)
4. **Galería de avatares predeterminados**
5. **Recorte manual avanzado**

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en la terminal (`bun start`)
2. Verifica el archivo `.env`
3. Prueba con una imagen pequeña primero
4. Contacta al equipo de desarrollo
