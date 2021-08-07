Moralis.initialize("bRNMZ4T0gK5bw6wIalzzZOu83md5eRQx35nRy3eq");

Moralis.serverURL = 'https://13yev3ofmjtr.usemoralis.com:2053/server'

const TOKEN_CONTRACT_ADDRESS = "0xCC46F5c86B9B14A5Ef82eE0B181651ECee6dD4e6"

init = async () => {
    hideElement(userInfo);
    hideElement(createItemForm);
    window.web3 = await Moralis.Web3.enable();
    initUser();
}

initUser = async () =>{
    if(await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
        showElement(openCreateItemButton);
    }else{
        showElement(userConnectButton);
        hideElement(userProfileButton);
        hideElement(openCreateItemButton);
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
        //User Email
        const email = user.get('email')
        if(email)
        {
            userEmailField.value = email;
        }
        else
        {
            userEmailField.value = "";
        }

        //User Name
        userUsernameField.value = user.get('username');

        //Avatar
        const userAvatar = user.get('avatar')
        if(userAvatar)
        {
            userAvatarImg.src = userAvatar.url();
        }
        else
        {
            hideElement(userAvatarImg);
        }

        showElement(userInfo);
    }else{
        login();
    }
}

//Store all user settings
saveUserInfo = async () =>
{
    user.set('email', userEmailField.value);
    user.set('username', userUsernameField.value);

    if (userAvatarFile.files.length > 0) 
    {      
        const avatar = new Moralis.File("avatar.jpeg", userAvatarFile.files[0]);
        user.set('avatar', avatar);
    }

    //Save and display
    await user.save();
    alert("User Info saved Successfully");
    openUserInfo();
}

createItem = async () => {
    if(createItemFile.files.leength == 0)
    {
        alert("Please select File");
        return;
    }
    else if(createItemName.value.length == 0)
    {
        alert("Needs a name");
        return;
    }

    //Push File to IPFS
    const nftFile = new Moralis.File("nftFile.jpeg", createItemFile.files[0]);
    await nftFile.saveIPFS();
    const nftFilePath = nftFile.ipfs();
    const nftFileHash = nftFile.hash();

    //Push Meta data to IPFS
    const metadata = {
        name: createItemName.value,
        description: createItemDescription.value,
        nftFilePath: nftFilePath,
        nftFileHash: nftFileHash,
    };
    const nftFileMetadataFile = new Moralis.File("metadata.json", {base64: btoa(JSON.stringify(metadata))});
    await nftFileMetadataFile.saveIPFS();
    const nftFileMetadataFilePath = nftFile.ipfs();
    const nftFileMetadataFileHash = nftFile.hash();


    console.log(createItemName.value);
    console.log(createItemDescription.value);
    console.log(nftFilePath);

    //Moralis Object
    const Item = Moralis.Object.extend("Item");
    const item = new Item();
    item.set('name', createItemName.value);
    item.set('description', createItemDescription.value);
    item.set('nftFilePath', nftFilePath);
    item.set('nftFileHash', nftFileHash);
    item.set('metadataFilePath', nftFileMetadataFilePath);
    item.set('metadataFileHash', nftFileMetadataFileHash);
    await item.save();
    console.log(item);
}

hideElement = (element) => element.style.display = "none";
showElement = (element) => element.style.display = "block"


//NAV BAR
//Click to Login
const userConnectButton = document.getElementById("btnConnect");
userConnectButton.onclick = login;

//Show user info when profile button clicked
const userProfileButton = document.getElementById("btnUserInfo");
userProfileButton.onclick = openUserInfo;

const openCreateItemButton = document.getElementById("btnOpenCreateItem");
openCreateItemButton.onclick = ()=> showElement(createItemForm);
document.getElementById("btnCloseCreateItem").onclick = () => hideElement(createItemForm);


//User Profile
const userInfo = document.getElementById("userInfo");
const userUsernameField = document.getElementById("txtUsername");
const userEmailField = document.getElementById("txtEmail");
const userAvatarImg = document.getElementById("imgAvatar");
const userAvatarFile = document.getElementById("fileAvatar");

//Log out
document.getElementById("btnCloseUserInfo").onclick = () => hideElement(userInfo);
document.getElementById("btnLogout").onclick = logout;
document.getElementById("btnSaveUserInfo").onclick = saveUserInfo;

//Create Item
const createItemForm = document.getElementById("createItem");

const createItemName = document.getElementById("txtCreateItemName");
const createItemDescription = document.getElementById("txtCreateItemDescription");
const createItemPrice = document.getElementById("numberCreateItemPrice")
const createItemStatus = document.getElementById("selectCreateItemStatus");
const createItemFile = document.getElementById("fileCreateItemFile");


document.getElementById("btnCreateItem").onclick = createItem;


init();