$(document).ready(function() {
  let playersTable = $("#players-table").DataTable();
  let playersStats = [];
  let season = 2018;
  let positions = ["WR"];
  let teamCode = "";

  const playersTeam$ = $("#players-team");
  const defenseTeams$ = $("#defense-teams");

  // make network request to fetch team list data
  $.get("./data/teams.json", function(teams) {
    const allTeams = teams.data
      .map(
        team =>
          `<option data-code=${team[0]} value="${team[1]}">${team[1]}</option>`
      )
      .join("");

    playersTeam$.html(allTeams);
    defenseTeams$.html(allTeams);
  });

  // make network request to fetch players stats
  $.get("./data/players.json", function(stats) {
    playersStats = stats;

    getPlayersStats(season);
  });

  // display fetched players stat in players table
  function getPlayersStats(season, teamCode) {
    const stats = playersStats[season].data
      .filter(stat => {
        if (!teamCode || teamCode === "All") {
          return positions.includes(stat[2]);
        }
        return stat[3] === teamCode && positions.includes(stat[2]);
      })
      .map((stat, index) => {
        stat[0] = index + 1;
        return stat;
      });

    playersTable.destroy();

    playersTable = $("#players-table").DataTable({
      data: stats
    }); // load data in table
  }

  // get selected option value from dropdown
  function getSelectedValue(e) {
    teamCode = $(this)
      .children("option:selected")
      .attr("data-code");

    getPlayersStats(season, teamCode);
  }

  playersTeam$.change(getSelectedValue);

  // listen for click on positions and filter accordingly
  $("input[type=checkbox]").click(function() {
    if ($(this).is(":checked")) {
      positions.push($(this).val());
    } else {
      const positionValue = $(this).val();
      positions = positions.filter(position => position !== positionValue);
    }

    getPlayersStats(season, teamCode);
  });

  // listen for when user select different season and filter table data
  $("#seasons").change(function() {
    season = parseInt(
      $(this)
        .children("option:selected")
        .val(),
      10
    );

    getPlayersStats(season, teamCode);
  });
});
