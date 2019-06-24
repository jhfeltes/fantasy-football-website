$(document).ready(function() {
  let positionsTable = $("#positions-table").DataTable();
  let stats = [];
  let teamName = "arizona";
  let position = "WR";

  const teams$ = $("#teams"); // get select element on page

  // make network request to fetch team list data
  $.get("./data/teams.json", function(teams) {
    const [x, ...allTeams] = teams.data;
    teams$.html(
      allTeams
        .map(team => `<option value="${team[1]}">${team[1]}</option>`)
        .join("")
    );
  });

  // make network request to fetch team positions data
  $.get("./data/team-positions.json", function(data) {
    stats = data;
    getTeamPositionStat(position, teamName);
  });

  // filter table data based on selected position
  function getPostionStatForTeam(teamStat, position) {
    return teamStat
      .filter(stat => stat.includes(position))
      .map(stat => {
        const [x, ...other] = stat;
        return other;
      });
  }

  // display fetch data for teams positions in table
  function getTeamPositionStat(position, teamName) {
    const teamStat = stats[teamName] || {};
    const statData = getPostionStatForTeam(teamStat.data || [], position);

    positionsTable.destroy();

    positionsTable = $("#positions-table").DataTable({
      data: statData
    });
  }

  // get selected option value from dropdown
  function getSelectedValue(e) {
    const value = $(this)
      .children("option:selected")
      .val();

    if (e.target.id === "positions") {
      position = value;
    } else {
      teamName = value.toLowerCase().replace(" ", "-");
    }

    getTeamPositionStat(position, teamName);
  }

  // listen for dropdown item click
  teams$.change(getSelectedValue);

  $("#positions").change(getSelectedValue);
});
