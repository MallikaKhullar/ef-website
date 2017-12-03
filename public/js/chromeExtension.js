function installChromeApp() {
    // chrome.webstore.install();
    chrome.webstore.install(
        "https://chrome.google.com/webstore/detail/flutur-small-flutters-cau/onebagjpomhjadhoiianmnelkbcnllnf",
        function() {
            console.log("here");
        },
        function(err) {
            console.log("no here," + err);
            window.location.href = "https://chrome.google.com/webstore/detail/flutur-small-flutters-cau/onebagjpomhjadhoiianmnelkbcnllnf";
        });
}