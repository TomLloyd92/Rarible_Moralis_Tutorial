Moralis.initialize("bRNMZ4T0gK5bw6wIalzzZOu83md5eRQx35nRy3eq");

Moralis.serverURL = 'https://13yev3ofmjtr.usemoralis.com:2053/server'

init = async () => {
    hideElement(userInfo);
    window.web3 = await Moralis.Web3.enable();
    initUser();
}

initUser = async () =>{
    if(await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
    }else{
        showElement(userConnectButton);
        hideElement(userProfileButton);
    }
}

login = async () => {
    try{
        //Sign in to meta mask
        await Moralis.Web3.authenticate();
        //Now will show correct button
        initUser();
    }catch{
        alert(error)
    }
}

logout = async () =>{
    await Moralis.User.logOut();
    hideElement(userInfo);
    initUser();
}

openUserInfo = async () => {
    user = await Moralis.User.current();
    if(user){
        showElement(userInfo);
    }else{
        login();
    }
}

hideElement = (element) => element.style.display = "none";
showElement = (element) => element.style.display = "block"


//Click to Login
const userConnectButton = document.getElementById("btnConnect");
userConnectButton.onclick = login;

//Show user info when profile button clicked
const userProfileButton = document.getElementById("btnUserInfo");
userProfileButton.onclick = openUserInfo;

//Close User Info
const userInfo = document.getElementById("userInfo");
document.getElementById("btnCloseUserInfo").onclick = () => hideElement(userInfo);
document.getElementById("btnLogout").onclick = logout;


init();