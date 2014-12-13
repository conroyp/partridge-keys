var keysPage = false;

/**
 * Walk the document body, applying swap to text nodes
 */
walk(document.body);
// We don't even try an image swap unless we know we've made
// some keys-related chagnes already
if (keysPage) {
    // We have to wait for the doc ready state to be complete, as otherwise
    // our iamge changes get lost behind things like lazy loading, responsive
    // image rewriting in js etc
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            imageSwap();
            clearInterval(readyStateCheckInterval);
        }
    }, 50);
}

/**
 * Walk the given node, passing off to text substitution as required
 * Function from the Cloud to Butt extension, which got it originally
 * from http://is.gd/mwZp7E
 *
 * @param node node
 */
function walk(node)
{
    var child, next;

    switch ( node.nodeType )
    {
        case 1:  // Element
        case 9:  // Document
        case 11: // Document fragment
            child = node.firstChild;
            while ( child )
            {
                next = child.nextSibling;
                walk(child);
                child = next;
            }
            break;

        case 3: // Text node
            textReplace(node);
            break;
    }
}


/**
 * Handle the text node replacements
 *
 * @param node textNode
 */
function textReplace(textNode)
{
    var v = textNode.nodeValue;

    // If our node is 4 chars (min Keys match) or less, bail
    // immediately rather than wasting cycles on substitutions
    if (v.trim().length < 4) {
        return;
    }

    var replacements = {
        "richard keys": "Alan Partridge",
        "richard": "Alan",
        "keys": "Partridge"
    };

    var keys = Object.keys(replacements);
    for (var x = 0; x < keys.length; x++) {
        var regex = new RegExp(keys[x], 'gi');
        if (v.match(regex)) {
            v = v.replace(regex, replacements[keys[x]]);
            // Set flag to indicate that we've made a change. This is
            // later used to determine whether it's worth doing image swaps
            keysPage = true;
        }
    }
    textNode.nodeValue = v;
}


/**
 * Swap any image that mentions 'keys' for a random Partridge image
 */
function imageSwap()
{
    var partridgeImages = [
        "http://i1.mirror.co.uk/incoming/article2136573.ece/alternates/s2197/Alan-Partridge.jpg",
        "http://now-here-this.timeout.com/wp-content/uploads/2011/09/alan-partridge.jpg",
        "http://i.guim.co.uk/static/w-620/h--/q-95/sys-images/Guardian/Pix/pictures/2011/10/5/1317808930787/Infomania-Alan-Partridge-007.jpg",
        "http://www.independent.co.uk/incoming/article7734509.ece/alternates/w620/alan-partridge.jpg"
    ];

    for (var i = 0; i < document.getElementsByTagName("img").length; i++)
    {
        var img = document.getElementsByTagName("img")[i].src;
        // Match any image with keys in the filename
        if (img.match(/keys/gi)) {
            var imgIndex = Math.floor(Math.random() * partridgeImages.length);
            document.getElementsByTagName("img")[i].src = partridgeImages[imgIndex];
            document.getElementsByTagName("img")[i].style.height = 'auto';
        }
        // Special case for twitter avatar - consistent image replacement
        else if (img.match(/477725226571014144/g)) {
            document.getElementsByTagName("img")[i].src = partridgeImages[0];
        }
    }
}