$(document).ready(function() {
  let defenseTable = $("#defense-table").DataTable();
  let defenseStats = [];

  const defenseTeams$ = $("#defense-teams");

  // make network request to fetch defense stats
  $.get("./data/defense.json", function(stats) {
    defenseStats = stats.data.map(stat => {
      const [x, ...defenseStat] = stat;
      return defenseStat;
    });

    getDefenseStat(); // display in defense table
  });

  // display fetched defense stat in defense table
  function getDefenseStat(code) {
    defenseTable.destroy();
    if (!code) {
      defenseTable = $("#defense-table").DataTable({
        data: defenseStats
      });
    } else {
      defenseTable = $("#defense-table").DataTable({
        data: defenseStats.filter(stat => stat[0] === code)
      });
    }
  }

  // get selected option value from dropdown
  function getSelectedValue(e) {
    const teamCode = $(this)
      .children("option:selected")
      .attr("data-code");

    getDefenseStat(teamCode === "All" ? null : teamCode);
  }

  // listen for when user select different team and filter table data
  defenseTeams$.change(getSelectedValue);
});
