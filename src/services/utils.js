export function getInitials(fullName = '') {
  if (!fullName) return '';
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function formatDateFrWithoutYear(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function dateCreatedAt(date) {
    const d = new Date(date);

    const day = d.getDate();
    const month = d.toLocaleDateString('fr-FR', { month: 'long' });
    const time = d.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return `${day} ${month}, ${time}`;
}

export function removeAccents(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

export function statusLabel(status) {
  const labels = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    DONE: "Terminé",
  };
  return labels[status] ?? status;
}

export function styleLabel(status) {
  const labels = {
    TODO: "red",
    IN_PROGRESS: "orange",
    DONE: "green",
  };
  return labels[status] ?? status;
}