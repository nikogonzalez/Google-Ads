//sets adgroup as the entity in use
var ENTITY = 'AdGroup';
//adds 'pause on' string
var PAUSE_PREFIX = "Pause on ";
//adds 'enable on' string
var ENABLE_PREFIX = "Enable on ";
//Set report builder function query here?? -- I dont think i need this -- adding for reference
var QUERIES = [
  {'query' : 'SELECT CampaignName, Clicks, Impressions ' +
  'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
  'WHERE LabelNames CONTAINS_ANY ' + labelizer;
  }
];

function main() {
  //get current day from AdWords app
  var today = Utilities.formatDate(new Date(), AdWordsApp.currentAccount().getTimeZone(), "yyyy-MM-dd");
  //sets variable to 'Pause on yyyy-MM-dd
  var pauseAdGroup = PAUSE_PREFIX+today;
  //sets variable to 'Enable on yyyy-MM-dd
  var enableAdGroup = ENABLE_PREFIX+today;
  Logger.log("Looking for labels: " + [pauseAdGroup,enableAdGroup].join(' and '));

  var labelArray = buildLabelArray(pauseAdGroup,enableAdGroup);

  if(labelArray.length > 0) {
   var labelizer = "['" + labelArray.join("','") + "']";
   var entityIterator;
   if (ENTITY === 'AdGroup') {
       entityIterator = AdWordsApp.adGroups().withCondition("LabelNames CONTAINS_ANY "+labelizer).get();
       } else {
       throw "invalid entity yo";
       }

       while(entityIterator.hasNext()) {
       	var entity = entityIterator.next();
        //Call report builder function before removal of label
        reportBuilder(entity, pauseAdGroup);
        pauseEntity(entity, pauseAdGroup);
        reportBuilder(entity, enableAdGroup);
        enableEntity(entity, enableAdGroup);
       }
  }

  //Build report report builder function here -- function to export to sheets
  //Call function within main() and have it check for entityIterator to equal labelizer
  function reportbuilder() {
    Logger.log("Am i working??");
  }

  //Helper function to build a list of labels in the account
function buildLabelArray(pauseAdGroup,enableAdGroup) {
  var labelsArray = [];
  try {
    var labelIterator = AdWordsApp.labels().withCondition("Name IN ['"+pauseAdGroup+"','"+enableAdGroup+"']").get();
    while(labelIterator.hasNext()) {
      labelsArray.push(labelIterator.next().getName());
    }
    return labelsArray;
  } catch(e) {
    Logger.log(e);
  }
  return [];
}

//Helper function to pause entities
function pauseEntity(entity, pauseStr) {
  var labelIterator = entity.labels().withCondition("Name = '"+pauseAdGroup+"'").get();
  if(labelIterator.hasNext()) {
    entity.pause();
    entity.removeLabel(pauseAdGroup);
  }
}

//Helper function to enable entities
function enableEntity(entity, enableStr) {
  var labelIterator = entity.labels().withCondition("Name = '"+enableAdGroup+"'").get();
  if(labelIterator.hasNext()) {
    entity.enable();
    entity.removeLabel(enableAdGroup);
  }
}


}
