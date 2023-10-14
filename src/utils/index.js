const calculatePlayerRankings = (startExpMap, currentExpMap) => {
    console.log('startExpMap, currentExpMap', startExpMap, currentExpMap);
    let mappedData = Object.keys(currentExpMap).map((player) => {
        const curExp = currentExpMap[player];
        const stExp = startExpMap[player] || 0;
        const xpGain = curExp - stExp;

        return {
            PlayerName: player,
            StartExp: stExp,
            CurrentExp: curExp,
            ExpGain: xpGain
        };
    });
    const rankedData = mappedData.sort((a, b) => b.ExpGain - a.ExpGain);
    console.log('rankedData', rankedData);
    return rankedData;
};

const getPlayersExp = (members) => {
  const playerMap = {};
  members.forEach((member) => {
    const player = member.displayName;
    const exp = member.resourceContribution;
    playerMap[player] = exp;
  });
  return playerMap;
};

module.exports = {
  getPlayersExp,
  calculatePlayerRankings,
}