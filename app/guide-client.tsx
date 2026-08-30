'use client';

import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Box,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  History,
  MessageCircle,
  Monitor,
  MousePointer2,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldAlert,
  UserRoundPlus,
  UsersRound,
  WifiOff,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Category = 'Todos' | 'Paquetes' | 'Visitas' | 'Comunicación' | 'Turno';

type GuideStep = {
  title: string;
  body: string;
  image: string;
  note?: string;
};

type Guide = {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, 'Todos'>;
  image: string;
  accent: 'blue' | 'green' | 'purple' | 'amber' | 'cyan' | 'red';
  icon: LucideIcon;
  steps: GuideStep[];
};

const guides: Guide[] = [
  {
    id: 'registrar-paquete',
    title: 'Ingresar paquete',
    description: 'Registra una encomienda, supermercado, comida u otro envío.',
    category: 'Paquetes',
    image: '/manual/paquetes.png',
    accent: 'blue',
    icon: Box,
    steps: [
      { title: 'Abre Control de Paquetes', body: 'En la pantalla principal toca el botón verde “Paquetes Recibidos”.', image: '/manual/inicio.png' },
      { title: 'Elige el tipo', body: 'Selecciona Paquete, Supermercado, Comida u Otros según lo que llegó.', image: '/manual/paquetes.png' },
      { title: 'Marca el departamento', body: 'Ingresa el número en el teclado y toca OK. Revisa el número antes de continuar.', image: '/manual/paquete-departamento.png' },
      { title: 'Completa y registra', body: 'El proveedor y la nota son opcionales. Selecciona un proveedor o usa “Registrar sin proveedor”.', image: '/manual/paquete-detalles.png', note: 'Después de registrar, comprueba que el paquete aparezca en Pendientes.' },
    ],
  },
  {
    id: 'entregar-paquete',
    title: 'Entregar paquete',
    description: 'Confirma quién retira y deja registrado el retiro.',
    category: 'Paquetes',
    image: '/manual/paquete-entrega.png',
    accent: 'green',
    icon: PackageCheck,
    steps: [
      { title: 'Busca el departamento', body: 'En Pendientes ubica la tarjeta del departamento que viene a retirar.', image: '/manual/paquetes.png' },
      { title: 'Toca Entregar', body: 'Pulsa el botón verde “Entregar” de la tarjeta correcta.', image: '/manual/paquetes.png' },
      { title: 'Indica quién retira', body: 'Selecciona al residente registrado. Si no aparece, toca “Otra persona” y escribe el nombre.', image: '/manual/paquete-entrega.png' },
      { title: 'Comprueba el resultado', body: 'Confirma la entrega y verifica que el paquete deje de aparecer como pendiente.', image: '/manual/paquete-entrega.png', note: 'El sistema registra el retiro y puede enviar el aviso correspondiente.' },
    ],
  },
  {
    id: 'registrar-visita',
    title: 'Registrar visita',
    description: 'Registra visitas personales, empleadas y mantenciones.',
    category: 'Visitas',
    image: '/manual/visitas.png',
    accent: 'purple',
    icon: UserRoundPlus,
    steps: [
      { title: 'Abre Registro de Visitas', body: 'Desde Inicio toca el botón azul “Registrar Visita”.', image: '/manual/inicio.png' },
      { title: 'Elige el tipo', body: 'Selecciona Personal, Empleada o Mantención según corresponda.', image: '/manual/visitas.png' },
      { title: 'Marca el departamento', body: 'Ingresa el departamento de destino y toca OK.', image: '/manual/visita-departamento.png' },
      { title: 'Completa los datos', body: 'Escribe el nombre e indica si viene en auto. Si respondes Sí, registra patente y selecciona estacionamiento.', image: '/manual/visita-detalles.png', note: 'La patente y el estacionamiento faltaban en el manual impreso.' },
      { title: 'Registra el ingreso', body: 'Revisa la información y toca “Registrar Ingreso”. La persona debe aparecer en Visitas Activas.', image: '/manual/visitas.png' },
    ],
  },
  {
    id: 'marcar-salida',
    title: 'Marcar salida',
    description: 'Cierra correctamente una visita cuando deja el edificio.',
    category: 'Visitas',
    image: '/manual/visitas.png',
    accent: 'red',
    icon: UsersRound,
    steps: [
      { title: 'Abre las visitas', body: 'Entra a “Registrar Visita” y revisa la lista de Visitas Activas.', image: '/manual/visitas.png' },
      { title: 'Identifica a la persona', body: 'Comprueba nombre y departamento para evitar cerrar otra visita.', image: '/manual/visitas.png' },
      { title: 'Marca la salida', body: 'Toca el botón rojo “Salida” en su tarjeta y confirma si el sistema lo solicita.', image: '/manual/visitas.png', note: 'Este paso mantiene correcta la cantidad de personas dentro del edificio.' },
    ],
  },
  {
    id: 'mensajes',
    title: 'Revisar WhatsApp',
    description: 'Lee avisos, detecta mensajes nuevos y responde al departamento.',
    category: 'Comunicación',
    image: '/manual/mensajes.png',
    accent: 'green',
    icon: MessageCircle,
    steps: [
      { title: 'Abre WhatsApp', body: 'Toca el botón verde WhatsApp. El número rojo indica mensajes pendientes.', image: '/manual/inicio.png' },
      { title: 'Elige una conversación', body: 'Selecciona el departamento en la columna izquierda. El punto o contador marca mensajes nuevos.', image: '/manual/mensajes.png' },
      { title: 'Lee y responde', body: 'Escribe la respuesta en la parte inferior y envíala. Mantén el mensaje breve y claro.', image: '/manual/mensajes.png' },
      { title: 'Cuida el historial', body: 'No uses “Borrar historial” salvo instrucción expresa del administrador.', image: '/manual/mensajes.png', note: 'Borrar el historial puede eliminar contexto útil de la conversación.' },
    ],
  },
  {
    id: 'novedades',
    title: 'Agregar novedad',
    description: 'Deja un aviso, una urgencia o una tarea para el turno.',
    category: 'Comunicación',
    image: '/manual/novedades.png',
    accent: 'amber',
    icon: ClipboardList,
    steps: [
      { title: 'Abre Novedades', body: 'Desde Inicio toca “Novedades” o “Ver Historial Completo”.', image: '/manual/inicio.png' },
      { title: 'Elige la categoría', body: 'Usa Urgente para riesgos inmediatos, Info para avisos y Tarea para algo pendiente.', image: '/manual/novedades.png' },
      { title: 'Escribe con contexto', body: 'Indica qué ocurrió, dónde, cuándo y qué falta hacer. Evita mensajes ambiguos.', image: '/manual/novedades.png' },
      { title: 'Agrega la novedad', body: 'Toca “Agregar Novedad” y verifica que aparezca en el Registro del Turno.', image: '/manual/novedades.png' },
    ],
  },
  {
    id: 'cambio-turno',
    title: 'Cambio de turno',
    description: 'Entrega el turno con pendientes y tareas visibles.',
    category: 'Turno',
    image: '/manual/turno.png',
    accent: 'purple',
    icon: RefreshCw,
    steps: [
      { title: 'Abre Turno', body: 'Toca “Turno” o “Cambio de Turno” en la pantalla principal.', image: '/manual/inicio.png' },
      { title: 'Revisa el resumen', body: 'Comprueba visitas activas, paquetes pendientes y tareas abiertas.', image: '/manual/turno.png' },
      { title: 'Habla con quien entra', body: 'Comenta verbalmente las urgencias y confirma que la otra persona entendió.', image: '/manual/turno.png' },
      { title: 'Confirma el cambio', body: 'Selecciona al conserje que entra y toca “Confirmar Cambio de Turno”.', image: '/manual/turno.png', note: 'El botón se activa únicamente después de elegir a una persona.' },
    ],
  },
  {
    id: 'lobby-tv',
    title: 'Abrir Lobby TV',
    description: 'Muestra en otra pantalla qué departamentos tienen paquetes.',
    category: 'Turno',
    image: '/manual/inicio.png',
    accent: 'cyan',
    icon: Monitor,
    steps: [
      { title: 'Toca Lobby TV', body: 'Desde Inicio selecciona “Lobby TV”. Se abre en una pestaña nueva.', image: '/manual/inicio.png' },
      { title: 'Lleva la pestaña al televisor', body: 'Muestra esa pestaña en la pantalla del lobby según la configuración del edificio.', image: '/manual/inicio.png' },
      { title: 'Comprueba la actualización', body: 'La vista muestra departamentos con paquetes pendientes y se actualiza con los datos del sistema.', image: '/manual/paquetes.png', note: 'Esta función no estaba explicada en el manual impreso.' },
    ],
  },
  {
    id: 'historial',
    title: 'Revisar historial',
    description: 'Consulta los últimos movimientos y el registro completo.',
    category: 'Turno',
    image: '/manual/inicio.png',
    accent: 'blue',
    icon: History,
    steps: [
      { title: 'Mira Últimos Movimientos', body: 'La columna derecha de Inicio resume paquetes, visitas, salidas y novedades recientes.', image: '/manual/inicio.png' },
      { title: 'Abre el registro completo', body: 'Toca “Ver Historial Completo” para revisar el Libro de Novedades.', image: '/manual/novedades.png' },
      { title: 'Busca el contexto', body: 'Revisa la hora, el tipo de movimiento y el departamento relacionado antes de actuar.', image: '/manual/novedades.png' },
    ],
  },
];

const categories: Category[] = ['Todos', 'Paquetes', 'Visitas', 'Comunicación', 'Turno'];

type Annotation = { x: string; y: string; width: string; height: string; label: string };

const annotations: Record<string, Annotation> = {
  'registrar-paquete:0': { x: '39%', y: '18%', width: '36%', height: '42%', label: 'Toca Paquetes Recibidos' },
  'registrar-paquete:1': { x: '2.5%', y: '15%', width: '20%', height: '39%', label: 'Elige el tipo' },
  'registrar-paquete:2': { x: '38.5%', y: '18%', width: '25%', height: '64%', label: 'Marca el departamento' },
  'registrar-paquete:3': { x: '38.5%', y: '18%', width: '28%', height: '67%', label: 'Completa y registra' },
  'entregar-paquete:0': { x: '22%', y: '15%', width: '75%', height: '28%', label: 'Busca el departamento' },
  'entregar-paquete:1': { x: '25%', y: '19%', width: '13%', height: '9%', label: 'Toca Entregar' },
  'entregar-paquete:2': { x: '38.5%', y: '25%', width: '29%', height: '46%', label: 'Indica quién retira' },
  'entregar-paquete:3': { x: '38.5%', y: '25%', width: '29%', height: '46%', label: 'Confirma el retiro' },
  'registrar-visita:0': { x: '2%', y: '18%', width: '36%', height: '42%', label: 'Toca Registrar Visita' },
  'registrar-visita:1': { x: '2.5%', y: '16%', width: '20%', height: '31%', label: 'Elige el tipo' },
  'registrar-visita:2': { x: '38.5%', y: '18%', width: '25%', height: '64%', label: 'Marca el departamento' },
  'registrar-visita:3': { x: '40%', y: '20%', width: '28%', height: '61%', label: 'Completa los datos' },
  'registrar-visita:4': { x: '22%', y: '15%', width: '75%', height: '34%', label: 'Comprueba el ingreso' },
  'marcar-salida:0': { x: '22%', y: '15%', width: '75%', height: '65%', label: 'Revisa Visitas Activas' },
  'marcar-salida:1': { x: '23%', y: '18%', width: '56%', height: '18%', label: 'Verifica nombre y depto.' },
  'marcar-salida:2': { x: '84%', y: '18%', width: '12%', height: '20%', label: 'Toca Salida' },
  'mensajes:0': { x: '2%', y: '68%', width: '36%', height: '9%', label: 'Toca WhatsApp' },
  'mensajes:1': { x: '1.5%', y: '10%', width: '26%', height: '78%', label: 'Elige el departamento' },
  'mensajes:2': { x: '27%', y: '87%', width: '70%', height: '9%', label: 'Escribe y envía' },
  'mensajes:3': { x: '20%', y: '7%', width: '7%', height: '8%', label: 'No borrar sin autorización' },
  'novedades:0': { x: '2%', y: '58%', width: '36%', height: '9%', label: 'Toca Novedades' },
  'novedades:1': { x: '2%', y: '20%', width: '19%', height: '18%', label: 'Elige la categoría' },
  'novedades:2': { x: '2%', y: '39%', width: '19%', height: '21%', label: 'Escribe aquí' },
  'novedades:3': { x: '3%', y: '62%', width: '17%', height: '9%', label: 'Toca Agregar Novedad' },
  'cambio-turno:0': { x: '39%', y: '68%', width: '36%', height: '9%', label: 'Toca Turno' },
  'cambio-turno:1': { x: '23%', y: '16%', width: '53%', height: '22%', label: 'Revisa el resumen' },
  'cambio-turno:2': { x: '23%', y: '42%', width: '53%', height: '23%', label: 'Haz el traspaso' },
  'cambio-turno:3': { x: '23%', y: '68%', width: '53%', height: '10%', label: 'Confirma el cambio' },
  'lobby-tv:0': { x: '39%', y: '58%', width: '36%', height: '9%', label: 'Toca Lobby TV' },
  'lobby-tv:1': { x: '39%', y: '58%', width: '36%', height: '9%', label: 'Se abre otra pestaña' },
  'lobby-tv:2': { x: '22%', y: '15%', width: '75%', height: '65%', label: 'Comprueba los pendientes' },
  'historial:0': { x: '77%', y: '17%', width: '22%', height: '62%', label: 'Últimos Movimientos' },
  'historial:1': { x: '78%', y: '80%', width: '20%', height: '8%', label: 'Ver historial completo' },
  'historial:2': { x: '23%', y: '13%', width: '74%', height: '73%', label: 'Revisa fecha y detalle' },
};

export default function GuideClient() {
  const [selected, setSelected] = useState<Guide | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [category, setCategory] = useState<Category>('Todos');
  const [query, setQuery] = useState('');

  const visibleGuides = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('es');
    return guides.filter((guide) => {
      const matchesCategory = category === 'Todos' || guide.category === category;
      const matchesQuery = !normalizedQuery || `${guide.title} ${guide.description}`.toLocaleLowerCase('es').includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') setCurrentStep((step) => Math.min(step + 1, selected.steps.length - 1));
      if (event.key === 'ArrowLeft') setCurrentStep((step) => Math.max(step - 1, 0));
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selected]);

  const openGuide = (guide: Guide) => {
    setSelected(guide);
    setCurrentStep(0);
  };

  const activeStep = selected?.steps[currentStep];
  const annotation = selected ? annotations[`${selected.id}:${currentStep}`] : undefined;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <BookOpen aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold text-blue-700">PorterIA · Gran Bretaña</p>
              <p className="text-lg font-black tracking-tight">Guía del conserje</p>
            </div>
          </div>
          <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:inline-flex">
            Guía interactiva
          </span>
        </div>
      </header>

      <section className="hero-grid border-b border-blue-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_420px] lg:items-center lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-blue-700">Ayuda paso a paso</p>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">¿Qué necesitas hacer?</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Elige una función para ver el procedimiento con imágenes. Avanza a tu ritmo y vuelve al inicio cuando quieras.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold text-slate-600">
              <span className="info-pill"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Pasos verificados</span>
              <span className="info-pill"><WifiOff className="h-4 w-4 text-blue-600" /> Incluye modo offline</span>
              <span className="info-pill"><Monitor className="h-4 w-4 text-purple-600" /> Diseñada para tablet</span>
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-100 shadow-xl shadow-blue-950/10">
            <Image src="/manual/inicio.png" alt="Pantalla principal del sistema PorterIA" fill priority sizes="(max-width: 1024px) 100vw, 420px" className="object-cover object-top" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Procedimientos</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight">Selecciona una función</h2>
          </div>
          <label className="relative block w-full lg:max-w-sm">
            <span className="sr-only">Buscar en la guía</span>
            <Search aria-hidden="true" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar: paquete, visita, turno..." className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </label>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Filtrar procedimientos">
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${category === item ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700'}`}>{item}</button>
          ))}
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleGuides.map((guide) => {
            const Icon = guide.icon;
            return (
              <button key={guide.id} className={`group guide-card guide-card--${guide.accent}`} onClick={() => openGuide(guide)}>
                <span className="relative block aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
                  <Image src={guide.image} alt={`Pantalla para ${guide.title.toLowerCase()}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover object-top transition duration-300 group-hover:scale-[1.02]" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-slate-700 shadow-sm backdrop-blur">{guide.steps.length} pasos</span>
                </span>
                <span className="flex items-start gap-4 px-1 pt-5 text-left">
                  <span className="guide-card__icon"><Icon aria-hidden="true" className="h-6 w-6" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-xl font-black">{guide.title}</span><span className="mt-1 block text-sm leading-6 text-slate-600">{guide.description}</span></span>
                  <ChevronRight aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700" />
                </span>
              </button>
            );
          })}
        </div>

        {visibleGuides.length === 0 && <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><Search className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-3 font-black">No encontramos ese procedimiento</p><p className="mt-1 text-sm text-slate-500">Prueba con paquete, visita, mensaje o turno.</p></div>}
      </section>

      <section className="border-y border-amber-200 bg-amber-50">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-9 lg:grid-cols-[auto_1fr] lg:px-8">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700"><ShieldAlert className="h-6 w-6" /></span>
          <div><h2 className="text-xl font-black text-amber-950">Importante sobre SOS / Emergencia</h2><p className="mt-2 max-w-4xl leading-7 text-amber-900">El botón rojo visible en la aplicación todavía no tiene una acción configurada. No debe reemplazar el citófono, los teléfonos de emergencia ni el protocolo oficial del edificio. Esta guía se actualizará cuando esa función esté operativa.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="support-card"><WifiOff className="h-6 w-6 text-blue-600" /><h3>Si se cae internet</h3><p>Continúa trabajando. Los cambios quedan pendientes y se sincronizan cuando regresa la conexión.</p></article>
          <article className="support-card"><CircleAlert className="h-6 w-6 text-red-600" /><h3>Números rojos</h3><p>Indican pendientes: paquetes sin entregar o mensajes nuevos por revisar.</p></article>
          <article className="support-card"><CheckCircle2 className="h-6 w-6 text-emerald-600" /><h3>Antes de terminar</h3><p>Revisa visitas activas, paquetes pendientes y novedades antes del cambio de turno.</p></article>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8"><p><strong className="text-white">Guía PorterIA</strong> · Gran Bretaña</p><p className="text-slate-400">Next.js · React · Tailwind CSS · Lucide</p></div>
      </footer>

      {selected && activeStep && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-labelledby="guide-title" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}>
          <section className="flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-7">
              <div className="min-w-0"><p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">{selected.category} · Paso {currentStep + 1} de {selected.steps.length}</p><h2 id="guide-title" className="truncate text-xl font-black sm:text-2xl">{selected.title}</h2></div>
              <button className="ml-4 rounded-full bg-slate-100 p-3 text-slate-700 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" onClick={() => setSelected(null)} aria-label="Cerrar guía"><X className="h-5 w-5" /></button>
            </div>
            <div className="h-1.5 bg-slate-100" aria-hidden="true"><div className="h-full bg-blue-600 transition-all" style={{ width: `${((currentStep + 1) / selected.steps.length) * 100}%` }} /></div>
            <div className="grid min-h-0 flex-1 overflow-auto lg:grid-cols-[1.45fr_0.75fr]">
              <div className="bg-slate-100 p-3 sm:p-6"><div className="relative aspect-[16/10] min-h-[250px] overflow-hidden rounded-2xl border border-slate-200 bg-white"><Image key={activeStep.image} src={activeStep.image} alt={`Paso ${currentStep + 1}: ${activeStep.title}`} fill priority sizes="(max-width: 1024px) 100vw, 65vw" className="object-contain" />{annotation && <div className="tutorial-highlight" style={{ left: annotation.x, top: annotation.y, width: annotation.width, height: annotation.height }} aria-hidden="true"><span className="tutorial-label"><MousePointer2 className="h-4 w-4" />{annotation.label}</span></div>}</div></div>
              <div className="flex flex-col p-5 sm:p-7">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-lg font-black text-white">{currentStep + 1}</span>
                <h3 className="mt-5 text-2xl font-black tracking-tight">{activeStep.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{activeStep.body}</p>
                {activeStep.note && <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /><p>{activeStep.note}</p></div>}
                <div className="mt-auto flex items-center justify-between gap-3 pt-8">
                  <button onClick={() => setCurrentStep((step) => Math.max(0, step - 1))} disabled={currentStep === 0} className="step-button step-button--secondary"><ArrowLeft className="h-5 w-5" /> Anterior</button>
                  {currentStep < selected.steps.length - 1 ? <button onClick={() => setCurrentStep((step) => Math.min(selected.steps.length - 1, step + 1))} className="step-button step-button--primary">Siguiente <ArrowRight className="h-5 w-5" /></button> : <button onClick={() => setSelected(null)} className="step-button step-button--done"><CheckCircle2 className="h-5 w-5" /> Terminar</button>}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
