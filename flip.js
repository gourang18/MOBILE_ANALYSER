let puppeteer=require("puppeteer");
let fs=require("fs");
let path=require("path");
let pdfkit=require("pdfkit")
const { executionAsyncResource } = require("async_hooks");
let browserStartPromises=puppeteer.launch({
    headless:false,
    
    defaultViewport:null,
    args:["--start-maximised","--disable-notifications"]

});
let page,browser;
let companyArr,mobileName;
(async function fn(){
    try{
    browser=await browserStartPromises;
    console.log("Browser opened");
    page=await browser.newPage();
    await page.goto("https://www.flipkart.com/");
    await page.waitForSelector("._2KpZ6l._2doB4z");
    await page.click("._2KpZ6l._2doB4z");
    await page.goto("https://www.flipkart.com/mobile-phones-store?fm=neo%2Fmerchandising&iid=M_4e03d5a5-76c3-4b33-9d71-af814af3ca2b_1_372UD5BXDFYS_MC.ZRQ4DKH28K8J&otracker=hp_rich_navigation_3_1.navigationCard.RICH_NAVIGATION_Mobiles_ZRQ4DKH28K8J&otracker1=hp_rich_navigation_PINNED_neo%2Fmerchandising_NA_NAV_EXPANDABLE_navigationCard_cc_3_L0_view-all&cid=ZRQ4DKH28K8J");

    await page.waitForSelector(".h1Fvn6");
    companyArr=await page.$$(".h1Fvn6");
    console.log(companyArr.length);
        for(let i=0;i<companyArr.length;i++){
            await page.waitForSelector(".h1Fvn6");
            companyArr=await page.$$(".h1Fvn6");
        await companyArr[i].click();
        await page.waitForSelector("._4rR01T");
        let compName=await page.$$("._4rR01T");
        
        mobileName=await page.evaluate(el=> el.textContent,compName[i]);
        let company=mobileName.split(" ")[0];

        let pathC=path.join(__dirname,company);
        if(!fs.existsSync(pathC))
        await fs.promises.mkdir(pathC);

        await page.waitForSelector("._30jeq3._1_WHN1");
        let price=await page.$$("._30jeq3._1_WHN1");
        await page.waitForSelector("._1xgFaf");
        let description=await page.$$("._1xgFaf");
        
        for(let j=0;j<compName.length;j++){
            
            let priceText=await page.evaluate(el => el.textContent,price[j]);
            let descriptionText=await page.evaluate(el => el.textContent,description[j]);
            mobileName=await page.evaluate(x=> x.textContent,compName[j]);
            
            let pathOfModel=path.join(pathC,mobileName+".pdf");
            let obj={
                "price":priceText,
                "decription":descriptionText
            }
            let arr=[obj];
            let text=JSON.stringify(arr);
            let pdfDoc=new pdfkit();
            pdfDoc.pipe(fs.createWriteStream(pathOfModel));
            pdfDoc.text(text);
            pdfDoc.end();
           }
         await page.goBack();
        await page.waitForTimeout(5000);
    }
    }catch(err){
        console.log(err);
    }
})();

