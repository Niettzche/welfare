import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Ayuda = () => {
  return (
    <Layout>
      <div className="flex-1 min-h-screen bg-[#f0f0f0] bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] bg-[length:30px_30px] font-sans">
        <div className="w-full border-b-4 border-slate-900 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-8xl select-none pointer-events-none">
            AYUDA
          </div>

          <div className="max-w-4xl mx-auto px-6 py-14 md:py-20 relative z-10">
            <div className="inline-block bg-yellow-300 border-2 border-slate-900 px-4 py-1 font-bold text-slate-900 mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transform -rotate-2">
              SOPORTE
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-6">
              ¿Necesitas actualizar tu registro?
            </h1>

            <p className="text-lg md:text-xl font-bold text-slate-700 max-w-2xl">
              Para aplicar cambios, manda un mensaje a la mesa directiva o escribe a{' '}
              <a
                href="mailto:contacto@mastercreators.work"
                className="text-welfare-blue underline hover:text-blue-700"
              >
                contacto@mastercreators.work
              </a>
              .
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10 md:py-12">
          <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 md:p-8 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
              ¿Qué enviar?
            </h2>
            <ul className="text-slate-700 font-semibold space-y-2">
              <li>- Nombre del negocio (tal como aparece en el directorio)</li>
              <li>- Qué dato(s) quieres cambiar (teléfono, email, descripción, etc.)</li>
              <li>- Si quieres eliminar tu registro, indícalo explícitamente</li>
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:contacto@mastercreators.work?subject=Actualizar%20o%20eliminar%20mi%20registro&body=Incluye%20el%20nombre%20de%20tu%20negocio%20y%20los%20cambios%20que%20deseas."
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-900 text-white font-black border-2 border-slate-900 hover:bg-white hover:text-slate-900 transition-colors active:scale-[0.99]"
              >
                Enviar correo
              </a>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white text-slate-900 font-black border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-colors active:scale-[0.99]"
              >
                Volver al directorio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Ayuda;

