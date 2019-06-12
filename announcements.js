<script
  src="https://code.jquery.com/jquery-3.4.1.min.js"
  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  crossorigin="anonymous"></script>
<script type="text/javascript">

let announcementsArray = [];
let colArray = [];

$(document).ready(function(){
	SP.SOD.executeOrDelayUntilScriptLoaded(init, 'SP.js');
	
});

function init(){
		
	var clientContext = SP.ClientContext.get_current();
    this.siteUrlList = clientContext.get_web().get_lists().getByTitle('SiteUrls');

	var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View><Query></Query></View>');

    this.collListItem = siteUrlList.getItems(camlQuery);
	
    clientContext.load(this.collListItem);
	
    clientContext.executeQueryAsync(
        Function.createDelegate(this, this.onQuerySucceeded), 
        Function.createDelegate(this, this.onQueryFailed)
    );
}
function onQuerySucceeded(sender, args) {   
   var listItemInfo = '';

    var listItemEnumerator = collListItem.getEnumerator();
        
		var i=0;
		while (listItemEnumerator.moveNext()) {
			
			//i++;
			var oListItem = listItemEnumerator.get_current();
			 console.log("Reading Url : " + oListItem.get_item('Url'));
			 
			 //call rest function
			 var result = GetAnnouncements(oListItem.get_item('Url'), "Announcements");
			 
			
		}
		announcementsArray.sort(function(a,b){
	  // Turn your strings into dates, and then subtract them
	  // to get a value that is either negative, positive, or zero.
				  return  new Date(a.Expires) - new Date(b.Expires);
			});
			var sortedArray = announcementsArray.slice(0,5);
			console.log(announcementsArray);
			console.log(sortedArray);
		
    //alert(listItemInfo.toString());
}

function onQueryFailed(sender, args) {
   alert('Request failed. ' + args.get_message() + 
        '\n' + args.get_stackTrace());
}

function GetAnnouncements(siteurl, ListName) {
        var result = '';
        $.ajax({
            url: siteurl + "/_api/web/lists/GetByTitle('" + ListName + "')/Items?$select=Title,Expires&$orderby=Expires asc&$top=5",
            method: "GET",
            async: false,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
				result= data.d.results;
				//iterate and push in array
				for(var i=0 ;i <result.length ; i++)
				{
					var announcement = { Title: result[i].Title, Expires: result[i].Expires };
					announcementsArray.push(announcement);
				}
				
            },
            error: function (data) {
                console.log(data);
            }
        });
        return result;
    }
</script>