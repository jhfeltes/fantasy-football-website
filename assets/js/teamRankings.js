$(document).ready(function() {
  let teamTable = $("#team-table").DataTable();
  let stats = [];
  let season = 2018;
  let teamName = "arizona";

  const teams$ = $("#teams");

  // make network request to fetch team list data
  $.get("../data/teams.json", function(teams) {
    const [x, ...allTeams] = teams.data;
    teams$.html(
      allTeams
        .map(team => `<option value="${team[1]}">${team[1]}</option>`)
        .join("")
    );
  });

  $.get("../data/team-rankings.json", function(data) {
    stats = data;
    getTeamStat(season, teamName); // display data in table
  });

  // filter stats data by year/season
  function getStatForYear(stats, year) {
    return stats
      .filter(stat => stat.includes(year))
      .map(stat => {
        const [x, y, ...teamStat] = stat;
        return teamStat;
      });
  }

  // display fetched rankings stat in table
  function getTeamStat(season, teamName) {
    const teamStat = stats.teams[teamName] || {};
    const statData = getStatForYear(teamStat.data || [], season);

    teamTable.destroy();

    teamTable = $("#team-table").DataTable({
      data: statData
    });
  }

  // get selected option value from dropdown
  function getSelectedValue(e) {
    const value = $(this)
      .children("option:selected")
      .val();

    if (e.target.id === "season") {
      season = value;
    } else {
      teamName = value.toLowerCase().replace(/\s/g, "-");
      console.log(teamName);
    }

    getTeamStat(parseInt(season, 10), teamName);
  }

  // listen for when user select different team and filter table data
  teams$.change(getSelectedValue);

  // listen for when user select a different season and filter table data
  $("#season").change(getSelectedValue);
});
