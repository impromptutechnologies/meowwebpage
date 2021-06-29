var request = require("request");
const Bet = require("../models/betSchema");

const betResult = (id) => {
  const exists = Bet.find(
    {
      outcomeID: id,
    },
    (err, outcomeData) => {
      if (outcomeData.length == 0) {
        return console.log("no bets placed");
      } else {
        const options = {
          method: "GET",
          url: "https://v3.football.api-sports.io/fixtures",
          qs: {
            id: id,
          },
          headers: {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": process.env.API_SPORTS,
          },
        };
        request(options, (error, response, body) => {
          data = JSON.parse(body);
          console.log(data);
          if (error) throw new Error(error);

          if (
            data.response[0].fixture.status.short == "FT" ||
            data.response[0].fixture.status.short == "ET"
          ) {
            const team1 = data.response[0].teams.home.name;
            const team2 = data.response[0].teams.away.name;
            const code1 = `${team1
              .substring(0, 3)
              .replace(/\s+/g, "")
              .toUpperCase()}${team2
              .substring(0, 3)
              .replace(/\s+/g, "")
              .toUpperCase()}1`;
            const code2 = `${team1
              .substring(0, 3)
              .replace(/\s+/g, "")
              .toUpperCase()}${team2
              .substring(0, 3)
              .replace(/\s+/g, "")
              .toUpperCase()}2`;
            const code3 = `${team1
              .substring(0, 3)
              .replace(/\s+/g, "")
              .toUpperCase()}${team2
              .substring(0, 3)
              .replace(/\s+/g, "")
              .toUpperCase()}3`;
            if (data.response[0].teams.home.winner == true) {
              Bet.updateMany({ Code: code1 }, { status: "won" }, (err, res) => {
                if (err) {
                  console.log(error);
                }
              });
              Bet.deleteMany(
                {
                  $or: [{ Code: code2 }, { Code: code3 }],
                },
                (error, deleted) => {
                  if (error) {
                    console.log(error);
                  }
                }
              );
            }
            if (data.response[0].teams.away.winner == true) {
              Bet.updateMany({ Code: code2 }, { status: "won" }, (err, res) => {
                if (err) {
                  console.log(error);
                }
              });
              Bet.deleteMany(
                {
                  $or: [{ Code: code1 }, { Code: code3 }],
                },
                (error, deleted) => {
                  if (error) {
                    console.log(error);
                  }
                }
              );
            } else {
              Bet.updateMany({ Code: code3 }, { status: "won" }, (err, res) => {
                if (err) {
                  console.log(error);
                }
              });
              Bet.deleteMany(
                {
                  $or: [{ Code: code2 }, { Code: code1 }],
                },
                (error, deleted) => {
                  if (error) {
                    console.log(error);
                  }
                }
              );
            }
          } else {
            console.log("game still in progress");
          }
        });
      }
    }
  ).lean();
};

module.exports = betResult;