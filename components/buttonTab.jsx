function ButtonTab({ selectedDay, setSelectedDay, day }) {
  const displayDay = {
    terca: "Terça",
    quarta: "Quarta",
    quinta: "Quinta",
    sabado: "Sábado",
  };

  return (
    <button
      className={`${
        selectedDay === day ? "" : "opacity-30 hover:opacity-100"
      } bg-crimson p-2 m-2 rounded-md`}
      onClick={() => (selectedDay != day ? setSelectedDay(day) : null)}
    >
      Aulas de {displayDay[day]}
    </button>
  );
}

export { ButtonTab };
