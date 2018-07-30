//https://searchenginewatch.com/sew/how-to/2417479/adwords-scripts-discovery-pause-and-enable-ads-based-on-dates

var ENTITY = 'Ad'; //or Ad or Campaign
var PAUSE_PREFIX = "Pause on "; //look for labels "Pause on 2013-04-11"
var ENABLE_PREFIX = "Enable on "; //look for labels "Enable on 2013-04-11"


function main() {
  //get current day from AdWords app
  var todayStr = Utilities.formatDate(new Date(), AdWordsApp.currentAccount().getTimeZone(), "yyyy-MM-dd");
  var pauseStr = PAUSE_PREFIX+todayStr;
  var enableStr = ENABLE_PREFIX+todayStr;
  Logger.log("Looking for labels: " + [pauseStr,enableStr].join(' and '));

  var labelsArray = buildLabelArray(pauseStr,enableStr);

  if(labelsArray.length > 0) {
    var labelsStr = "['" + labelsArray.join("','") + "']";
    var entityIter;
    if(ENTITY === 'Keyword') {
      entityIter = AdWordsApp.keywords().withCondition("LabelNames CONTAINS_ANY "+labelsStr).get();
    } else if(ENTITY === 'Ad') {
      entityIter = AdWordsApp.ads().withCondition("LabelNames CONTAINS_ANY "+labelsStr).get();
    } else if(ENTITY === 'Campaign') {
      entityIter = AdWordsApp.campaigns().withCondition("LabelNames CONTAINS_ANY "+labelsStr).get();
    } else {
      throw 'Invalid ENTITY type. ENTITY should be Campaign, Keyword or Ad. ENTITY:'+ENTITY;
    }

    while(entityIter.hasNext()) {
      var entity = entityIter.next();
      pauseEntity(entity, pauseStr);
      enableEntity(entity, enableStr);
    }
  }
}

//Helper function to build a list of labels in the account
function buildLabelArray(pauseStr,enableStr) {
  var labelsArray = [];
  try {
    var labelIter = AdWordsApp.labels().withCondition("Name IN ['"+pauseStr+"','"+enableStr+"']").get();
    while(labelIter.hasNext()) {
      labelsArray.push(labelIter.next().getName());
    }
    return labelsArray;
  } catch(e) {
    Logger.log(e);
  }
  return [];
}

//Helper function to pause entities
function pauseEntity(entity, pauseStr) {
  var labelIter = entity.labels().withCondition("Name = '"+pauseStr+"'").get();
  if(labelIter.hasNext()) {
    entity.pause();
    entity.removeLabel(pauseStr);
  }
}

//Helper function to enable entities
function enableEntity(entity, enableStr) {
  var labelIter = entity.labels().withCondition("Name = '"+enableStr+"'").get();
  if(labelIter.hasNext()) {
    entity.enable();
    entity.removeLabel(enableStr);
  }
}
