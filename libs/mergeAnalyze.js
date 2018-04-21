const isProgrammer = require('./isProgrammer')


const mergeDataAndAnalyze =  (twitter, facebook) => {
  const twitterMerge = twitter.score.kalimat
  const facebookMerge = facebook.experiences.join(' ') + facebook.favorites.join(' ')
  const mergeAll = twitterMerge + facebookMerge
  console.log(mergeAll);
  return isProgrammer(mergeAll)
}


module.exports = mergeDataAndAnalyze
