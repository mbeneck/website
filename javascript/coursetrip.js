
var costs = {};
var descriptions = {};

function load_fees_callback(json)
{
    var title = json.feed.title.$t;
    costs[title] = {};
    descriptions[title] = {};
    for (var i = 0; i < json.feed.entry.length; i++)
    {
        var entry = json.feed.entry[i];
        var name = entry["gsx$" + "name"].$t;
        var description = entry["gsx$" + "description"].$t;
        var cost = entry["gsx$" + "cost"].$t;
        costs[title][name] = cost;
        descriptions[title][name] = description;
    }
    load_cached_fees('pay_form');
}

function load_fees_from_spreadsheet(doc_id, sheet_id)
{
    var script = document.createElement('script');
    script.setAttribute('src', 'https://spreadsheets.google.com/feeds/list'
            + '/' + doc_id + '/' + sheet_id + '/public/values' +
            '?alt=json-in-script&callback=load_fees_callback');
    script.setAttribute('id', 'jsonScript');
    script.setAttribute('type', 'text/javascript');
    document.documentElement.firstChild.appendChild(script);
}

function load_cached_fees(form_id)
{
    var form = document.getElementById(form_id);
    var select = form.elements["merchantDefinedData1"];
    var val = select.value;
    var choices = form.elements["payment_options"];
    if(costs[val])
    {
//        form.elements["amount"].style.display = 'inline';
        form.elements["amount"].readonly = true;
//        document.getElementById("amount_label").style.display = 'inline';
//        document.getElementById("merchant_defined_data3").style.display = 'none';
//        document.getElementById("notes_label").style.display = 'none';
        document.getElementById("payment_description").style.display = 'inline';
        document.getElementById("payment_description_spacer").style.display = 'inline';
        form.elements["merchantDefinedData4"].value="1";
        choices.style.display = 'inline';

        choices.options.length = 0;
        for(name in costs[val])
            choices.options[choices.options.length] = new Option(name, costs[val][name]);
        select_cached_fee(form_id);
    }
    else
    {
        form.elements["amount"].value = 0.00;
        form.elements["amount"].readonly = false;
//        form.elements["amount"].style.display = 'inline';
//        document.getElementById("amount_label").style.display = 'inline';
        document.getElementById("merchantDefinedData3").style.display = 'inline';
        document.getElementById("notes_label").style.display = 'inline';
        document.getElementById("payment_description").style.display = 'none';
        document.getElementById("payment_description_spacer").style.display = 'none';
        // choices.style.display = 'none';
        form.elements["merchantDefinedData2"].value = "";
    }
}

function select_cached_fee(form_id)
{
    var form = document.getElementById(form_id);
    var type = form.elements["merchantDefinedData1"].value;
    var val = form.elements["payment_options"].value;
    var name = form.elements["payment_options"].options[form.elements["payment_options"].selectedIndex].text;
    document.getElementById("payment_description").innerHTML = "<b>Comments:</b> " + descriptions[type][name];
    form.elements["merchantDefinedData2"].value = name;
    form.elements["amount"].value = val;
    form.elements["merchantDefinedData4"].value="1";
}

function change_count(form_id)
{
    var form = document.getElementById(form_id);
	var type = form.elements["merchantDefinedData1"].value;
    var val = form.elements["payment_options"].value;
    var name = form.elements["payment_options"].options[form.elements["payment_options"].selectedIndex].text;
    var count_element = form.elements["merchantDefinedData4"];
    var count = parseInt(count_element.value) || 1;
    if(count <= 0)
    {
        count = 1;
    }
    form.elements["amount"].value = val * count;
}
