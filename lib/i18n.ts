export type Locale = "es" | "en" | "no";

export const locales: Locale[] = ["en", "es", "no"];

export const localeLabels: Record<Locale, { native: string; flag: string }> = {
  es: { native: "Español", flag: "🇪🇸" },
  en: { native: "English", flag: "🇬🇧" },
  no: { native: "Norsk", flag: "🇳🇴" },
};

type Vars = Record<string, string | number>;
type Translator = string | ((v: Vars) => string);
type Dict = Record<string, Translator>;

const es: Dict = {
  "header.live": "En vivo",
  "header.brand": "RaceTracker",

  "rail.participants": "Participantes",
  "rail.stats": "Estadísticas",
  "rail.history": "Historial",
  "rail.settings": "Configuración",
  "rail.closePanel": "Cerrar panel",
  "rail.openPanel": "Abrir panel",

  "sidebar.search.placeholder": "Buscar nombre / dorsal",
  "sidebar.filter": "Filtrar",
  "sidebar.clearFilters": "Limpiar filtros",
  "sidebar.cols.pos": "Pos",
  "sidebar.cols.name": "Nombre",
  "sidebar.cols.km": "Km",
  "sidebar.cols.time": "Tiempo",
  "sidebar.empty": "Sin resultados.",
  "sidebar.count": ({ n, total }) => `${n} de ${total} corredores`,
  "sidebar.follow": ({ name }) => `Seguir a ${name}`,

  "filter.status": "Estado",
  "filter.gender": "Género",
  "filter.all": "Todos",
  "filter.running": "En curso",
  "filter.finished": "Finalizados",
  "filter.dnf": "DNF",
  "filter.male": "Masculino",
  "filter.female": "Femenino",

  "stats.running": "En curso",
  "stats.finished": "Finalizados",
  "stats.dnf": "DNF",
  "stats.currentLeader": "Líder actual",
  "stats.distribution": "Distribución por checkpoint",

  "history.event.crossesCp": ({ name, cp }) => `${name} cruza ${cp}`,
  "history.event.finishes": ({ name, rank }) =>
    `${name} finaliza la carrera (${rank}º)`,
  "history.event.dnf": ({ name, cp }) => `${name} abandona en ${cp} (DNF)`,

  "settings.section.map": "Mapa",
  "settings.section.units": "Unidades",
  "settings.section.theme": "Tema",
  "settings.section.language": "Idioma",
  "settings.showLeader": "Mostrar líder",
  "settings.showBib": "Mostrar dorsal (BIB)",
  "settings.predictive": "Tracking predictivo",
  "settings.favTracks": "Mostrar trayectos de favoritos",
  "settings.allNames": "Mostrar todos los nombres",
  "settings.runnersOnProfile": "Mostrar corredores en perfil",
  "settings.showElevation": "Mostrar perfil de elevación",
  "settings.routeDirection": "Mostrar dirección de la carrera",
  "settings.imperial": "Unidades imperiales",
  "settings.theme.light": "Claro",
  "settings.theme.dark": "Oscuro",
  "settings.theme.system": "Sistema",
  "settings.theme.change": "Cambiar tema",

  "replay.play": "Reproducir",
  "replay.pause": "Pausar",
  "replay.live": "En vivo",
  "replay.speed": "Velocidad",

  "map.aria": "Mapa del recorrido",
  "map.layer.topo": "Topo",
  "map.layer.grey": "Gris",
  "map.layer.osm": "OSM",
  "map.leaderBadge": ({ name }) => `Líder · ${name}`,

  "popup.bib": "BIB",
  "popup.rank": "Rank",
  "popup.distance": "Distancia",
  "popup.pace": "Ritmo",
  "popup.elevation": "Elevación",
  "popup.grade": "Pendiente",
  "popup.lastUpdate": "Última actualización",
  "popup.lastUpdate.ago": ({ mins }) => `hace ${mins} min`,
  "popup.follow": "Seguir en mapa",
  "popup.details": "Detalles",

  "dialog.splits": "Tiempos",
  "dialog.col.point": "Punto",
  "dialog.col.time": "Tiempo",
  "dialog.col.timeOfDay": "Hora",
  "dialog.start": "Salida",
  "dialog.finish": "Meta",
  "dialog.runnerPage": "Página del corredor",
  "dialog.close": "Cerrar",
  "dialog.runnerMeta": ({ category, ageGroup }) =>
    `${category} · ${ageGroup}`,
  "category.M": "Masculino",
  "category.F": "Femenino",

  "status.running": "En curso",
  "status.finished": "Finalizado",
  "status.dnf": "DNF",
  "status.preRace": "Pre-salida",
};

const en: Dict = {
  "header.live": "Live",
  "header.brand": "RaceTracker",

  "rail.participants": "Participants",
  "rail.stats": "Statistics",
  "rail.history": "History",
  "rail.settings": "Settings",
  "rail.closePanel": "Close panel",
  "rail.openPanel": "Open panel",

  "sidebar.search.placeholder": "Search name / bib",
  "sidebar.filter": "Filter",
  "sidebar.clearFilters": "Clear filters",
  "sidebar.cols.pos": "Pos",
  "sidebar.cols.name": "Name",
  "sidebar.cols.km": "Km",
  "sidebar.cols.time": "Time",
  "sidebar.empty": "No results.",
  "sidebar.count": ({ n, total }) => `${n} of ${total} runners`,
  "sidebar.follow": ({ name }) => `Follow ${name}`,

  "filter.status": "Status",
  "filter.gender": "Gender",
  "filter.all": "All",
  "filter.running": "Running",
  "filter.finished": "Finished",
  "filter.dnf": "DNF",
  "filter.male": "Male",
  "filter.female": "Female",

  "stats.running": "Running",
  "stats.finished": "Finished",
  "stats.dnf": "DNF",
  "stats.currentLeader": "Current leader",
  "stats.distribution": "Distribution by checkpoint",

  "history.event.crossesCp": ({ name, cp }) => `${name} crosses ${cp}`,
  "history.event.finishes": ({ name, rank }) =>
    `${name} finishes the race (${rank})`,
  "history.event.dnf": ({ name, cp }) => `${name} drops out at ${cp} (DNF)`,

  "settings.section.map": "Map",
  "settings.section.units": "Units",
  "settings.section.theme": "Theme",
  "settings.section.language": "Language",
  "settings.showLeader": "Show leader",
  "settings.showBib": "Show bib number",
  "settings.predictive": "Predictive tracking",
  "settings.favTracks": "Show favourites' tracks",
  "settings.allNames": "Show all names",
  "settings.runnersOnProfile": "Show runners on profile",
  "settings.showElevation": "Show elevation profile",
  "settings.routeDirection": "Show race direction",
  "settings.imperial": "Imperial units",
  "settings.theme.light": "Light",
  "settings.theme.dark": "Dark",
  "settings.theme.system": "System",
  "settings.theme.change": "Change theme",

  "replay.play": "Play",
  "replay.pause": "Pause",
  "replay.live": "Live",
  "replay.speed": "Speed",

  "map.aria": "Race map",
  "map.layer.topo": "Topo",
  "map.layer.grey": "Grey",
  "map.layer.osm": "OSM",
  "map.leaderBadge": ({ name }) => `Leader · ${name}`,

  "popup.bib": "BIB",
  "popup.rank": "Rank",
  "popup.distance": "Distance",
  "popup.pace": "Pace",
  "popup.elevation": "Elevation",
  "popup.grade": "Grade",
  "popup.lastUpdate": "Last update",
  "popup.lastUpdate.ago": ({ mins }) => `${mins} min ago`,
  "popup.follow": "Follow on map",
  "popup.details": "Details",

  "dialog.splits": "Splits",
  "dialog.col.point": "Point",
  "dialog.col.time": "Time",
  "dialog.col.timeOfDay": "Time of day",
  "dialog.start": "Start",
  "dialog.finish": "Finish",
  "dialog.runnerPage": "Runner page",
  "dialog.close": "Close",
  "dialog.runnerMeta": ({ category, ageGroup }) =>
    `${category} · ${ageGroup}`,
  "category.M": "Male",
  "category.F": "Female",

  "status.running": "Running",
  "status.finished": "Finished",
  "status.dnf": "DNF",
  "status.preRace": "Pre-race",
};

const no: Dict = {
  "header.live": "Direkte",
  "header.brand": "RaceTracker",

  "rail.participants": "Deltagere",
  "rail.stats": "Statistikk",
  "rail.history": "Historikk",
  "rail.settings": "Innstillinger",
  "rail.closePanel": "Lukk panel",
  "rail.openPanel": "Åpne panel",

  "sidebar.search.placeholder": "Søk navn / BIB",
  "sidebar.filter": "Filter",
  "sidebar.clearFilters": "Fjern filtre",
  "sidebar.cols.pos": "Plass",
  "sidebar.cols.name": "Navn",
  "sidebar.cols.km": "Km",
  "sidebar.cols.time": "Tid",
  "sidebar.empty": "Ingen resultater.",
  "sidebar.count": ({ n, total }) => `${n} av ${total} løpere`,
  "sidebar.follow": ({ name }) => `Følg ${name}`,

  "filter.status": "Status",
  "filter.gender": "Kjønn",
  "filter.all": "Alle",
  "filter.running": "I løp",
  "filter.finished": "Fullført",
  "filter.dnf": "DNF",
  "filter.male": "Menn",
  "filter.female": "Kvinner",

  "stats.running": "I løp",
  "stats.finished": "Fullført",
  "stats.dnf": "DNF",
  "stats.currentLeader": "Nåværende leder",
  "stats.distribution": "Fordeling per kontrollpunkt",

  "history.event.crossesCp": ({ name, cp }) => `${name} passerer ${cp}`,
  "history.event.finishes": ({ name, rank }) =>
    `${name} fullfører løpet (${rank}.)`,
  "history.event.dnf": ({ name, cp }) => `${name} bryter på ${cp} (DNF)`,

  "settings.section.map": "Kart",
  "settings.section.units": "Enheter",
  "settings.section.theme": "Tema",
  "settings.section.language": "Språk",
  "settings.showLeader": "Vis leder",
  "settings.showBib": "Vis startnummer (BIB)",
  "settings.predictive": "Prediktiv sporing",
  "settings.favTracks": "Vis favorittspor",
  "settings.allNames": "Vis alle navn",
  "settings.runnersOnProfile": "Vis løpere på profil",
  "settings.showElevation": "Vis høydeprofil",
  "settings.routeDirection": "Vis løpsretning",
  "settings.imperial": "Britiske enheter",
  "settings.theme.light": "Lys",
  "settings.theme.dark": "Mørk",
  "settings.theme.system": "System",
  "settings.theme.change": "Bytt tema",

  "replay.play": "Spill av",
  "replay.pause": "Pause",
  "replay.live": "Direkte",
  "replay.speed": "Hastighet",

  "map.aria": "Løypekart",
  "map.layer.topo": "Topo",
  "map.layer.grey": "Grå",
  "map.layer.osm": "OSM",
  "map.leaderBadge": ({ name }) => `Leder · ${name}`,

  "popup.bib": "BIB",
  "popup.rank": "Plass",
  "popup.distance": "Distanse",
  "popup.pace": "Tempo",
  "popup.elevation": "Høyde",
  "popup.grade": "Stigning",
  "popup.lastUpdate": "Sist oppdatert",
  "popup.lastUpdate.ago": ({ mins }) => `${mins} min siden`,
  "popup.follow": "Følg på kart",
  "popup.details": "Detaljer",

  "dialog.splits": "Tidsplitter",
  "dialog.col.point": "Punkt",
  "dialog.col.time": "Tid",
  "dialog.col.timeOfDay": "Klokkeslett",
  "dialog.start": "Start",
  "dialog.finish": "MÅL",
  "dialog.runnerPage": "Løperside",
  "dialog.close": "Lukk",
  "dialog.runnerMeta": ({ category, ageGroup }) =>
    `${category} · ${ageGroup}`,
  "category.M": "Mann",
  "category.F": "Kvinne",

  "status.running": "I løp",
  "status.finished": "Fullført",
  "status.dnf": "DNF",
  "status.preRace": "Pre-start",
};

const dictionaries: Record<Locale, Dict> = { es, en, no };

export function translator(locale: Locale): (key: string, vars?: Vars) => string {
  const dict = dictionaries[locale];
  return (key: string, vars?: Vars) => {
    const v = dict[key];
    if (v === undefined) return key;
    if (typeof v === "function") return v(vars ?? {});
    if (!vars) return v;
    return v.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
  };
}
