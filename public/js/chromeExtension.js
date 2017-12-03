function installChromeApp() {
    // chrome.webstore.install();
    chrome.webstore.install(
        undefined,
        undefined,
        function(err) {
            console.log("no here," + err);
            window.location.href = "https://chrome.google.com/webstore/detail/flutur-small-flutters-cau/onebagjpomhjadhoiianmnelkbcnllnf";
        });
}