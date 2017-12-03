function installChromeApp() {
    // chrome.webstore.install();
    chrome.webstore.install(
        "https://chrome.google.com/webstore/detail/onebagjpomhjadhoiianmnelkbcnllnf",
        function() {},
        function(err) {
            window.location.href = "https://chrome.google.com/webstore/detail/flutur-small-flutters-cau/onebagjpomhjadhoiianmnelkbcnllnf";
        });
}
