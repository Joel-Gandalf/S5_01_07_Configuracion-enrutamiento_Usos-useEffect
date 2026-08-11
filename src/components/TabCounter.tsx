import { useState, useEffect } from 'react';

export const TabCounter = () => {
  const [tabCount, setTabCount] = useState(0);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        setTabCount(c => c + 1);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return (
    <div className="tab-counter">
      <p>Has sortit de la pàgina: {tabCount} vegades</p>
    </div>
  );
};

// el navegador expone la ---Page Visibility API---, un mecanismo global a nivel de document (no de un elemento concreto de tu página) que emite un evento visibilitychange cada vez que la pestaña pasa de visible a oculta, o viceversa. Por eso el listener se pone en document, no en ningún botón — porque el evento en sí no pertenece a ningún elemento de tu interfaz, pertenece al documento completo/pestaña del navegador.

// document.visibilityState es una propiedad que te dice el estado actual: 'visible' (la pestaña está activa y a la vista) o 'hidden' (el usuario cambió de pestaña, minimizó, etc.). El if (document.visibilityState !== 'visible') filtra para que solo cuentes cuando el usuario se va (pasa a hidden), no también cuando vuelve (pasa de hidden a visible) — si no tuvieras ese filtro, contarías dos veces por cada "salida y vuelta" (una al irse, otra al volver), duplicando el contador.

// 'visible' — ¿nombre nuestro o propio del navegador?

// Es un valor propio y fijo del navegador, parte de la especificación de la Page Visibility API — no lo inventamos nosotros. document.visibilityState solo puede devolver uno de estos strings exactos, definidos por el estándar web:

// 'visible' — la pestaña está a la vista.
// 'hidden' — la pestaña no está a la vista (cambiaste de pestaña, minimizaste, etc.)

// 5. 'visibilitychange' — ¿nombre nuestro o propio de la API?

// Es también un nombre fijo, definido por la especificación del navegador — no es inventado por nosotros ni configurable. Es el identificador exacto del evento que dispara la Page Visibility API cuando cambia la visibilidad del documento. Tiene que escribirse exactamente así, con ese string literal, o el navegador nunca lo reconocería como el evento correcto.

// Es exactamente el mismo tipo de "nombre reservado del sistema" que ya conoces de otros eventos nativos del DOM, como 'click', 'submit', 'change', 'keydown' — todos son strings fijos que el navegador entiende internamente, no los inventa el desarrollador.



// localStorage.setItem(...) es efectivamente una llamada a una API del navegador — estás pidiéndole al navegador "guarda este dato". Eso es correcto, y en ese sentido sí "es cosa del navegador", en cuanto a dónde se guarda el dato.

// Pero fíjate en qué es lo que dispara que esta línea se ejecute: no es un evento del navegador que tú tengas que escuchar — es el propio ciclo de React reaccionando a que preferredCategory cambió, algo que tú mismo provocaste llamando a setPreferredCategory(...) desde dentro de tu aplicación (el onChange del select). React ya sabe que ese cambio ocurrió porque fue él mismo quien procesó setPreferredCategory — no necesita que nadie le avise desde fuera, porque el cambio nació dentro de su propio sistema de estado.

// localStorage.setItem(...) es una acción que tú ejecutas (como llamar a cualquier función), no un evento al que te suscribes. Es parecido a llamar a console.log(...) — usas una API del navegador, pero no estás "esperando" a que algo externo te avise de nada; simplemente ejecutas una instrucción cuando tu propio código decide hacerlo.

// En cambio, document.addEventListener('visibilitychange', ...) sí es una suscripción a un evento futuro e impredecible, que puede ocurrir en cualquier momento, sin que tu código haga nada para provocarlo — el usuario decide cambiar de pestaña por su cuenta, sin que ninguna línea de tu React lo cause.

// Resumiendo la distinción clave

// No es "usa una API del navegador" vs "no la usa" — ambos casos usan APIs del navegador (localStorage es una, document.addEventListener es otra). La distinción real es:

// ¿El cambio lo origina tu propio código React (a través de setState), o lo origina algo completamente externo y fuera de tu control (el usuario interactuando con el navegador mismo, no con tu app)?

// Si lo origina tu propio setState → React ya lo sabe, usas el array de dependencias normal.
// Si lo origina algo externo al ciclo de React → necesitas suscribirte activamente con addEventListener para enterarte.