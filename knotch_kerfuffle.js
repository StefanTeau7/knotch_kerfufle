
    
/* -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       __        __         _                                       _               _  __                 __            __    __   _          _ 
       \ \      / /   ___  | |   ___    ___    _ __ ___     ___    | |_    ___     | |/ /   ___   _ __   / _|  _   _   / _|  / _| | |   ___  | |
        \ \ /\ / /   / _ \ | |  / __|  / _ \  | '_ ` _ \   / _ \   | __|  / _ \    | ' /   / _ \ | '__| | |_  | | | | | |_  | |_  | |  / _ \ | |
         \ V  V /   |  __/ | | | (__  | (_) | | | | | | | |  __/   | |_  | (_) |   | . \  |  __/ | |    |  _| | |_| | |  _| |  _| | | |  __/ |_|
          \_/\_/     \___| |_|  \___|  \___/  |_| |_| |_|  \___|    \__|  \___/    |_|\_\  \___| |_|    |_|    \__,_| |_|   |_|   |_|  \___| (_)
**************************************************************************************************************************************************************************************************************************                            
                                                                Knotch-Kerfuffle v1.0
                                        /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
                                        /\/\/\/\/\/\/\/\/\/\/\/\ Attribution Notice /\/\/\/\/\/\/\/\/\/\/\/\/\
                                        /\/\/\/\/\/\ # Written by Vlad Vasilescu and Stefan Teau /\/\/\/\/\/\/
                                        /\/\/\/\/\/\ # Contact via e-mail vvasiles@andrew.cmu.edu /\/\/\/\/\/\
                                        /\/\/\/\/\/\ # Contact via e-mail steau@nyit.edu /\/\/\/\/\/\/\/\/\/\/
                                        /\/\/\/\/\/\/\/\/\/\/\/\ # USE AT OWN RISK! /\/\/\/\/\/\/\/\/\/\/\/\/\
                                        /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/



'use strict';
const fs = require ('fs');                          // File system handling             
const puppeteer = require ('puppeteer');            // Chrome remote control API
const queryString = require ('query-string');       // Data collection from ingress.gif
const process = require('process');
const chalk = require('chalk');                     // GUI style
const clear = require('clear');
const figlet = require('figlet');                   // GUI style
clear();
const ignoreChars = /[^!-~]/g;

const argv = require('yargs').argv;                 // CMD Client builder
                           

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

// just style
function rainbow(string, offset) {
    if (!string || string.length === 0) {
        return string;
    }

    const hueStep = 360 / string.replace(ignoreChars, '').length;

    let hue = offset % 360;
    const characters = [];
    for (const character of string) {
        if (character.match(ignoreChars)) {
            characters.push(character);
        } else {
            characters.push(chalk.hsl(hue, 100, 50)(character));
            hue = (hue + hueStep) % 360;
        }
    }

    return characters.join('');
}

async function animateString(string) {
    console.log();
        console.log('\u001B[1F\u001B[G', rainbow(string, 1));
        await delay(2); // eslint-disable-line no-await-in-loop
}

(async () => {
    console.log();
    await animateString(figlet.textSync('Welcome to Kerfuffle!', { horizontalLayout: 'full' }));
    console.log();
})();


//command line
require('yargs')
  .scriptName("Knotch Survey Unit Testing")
  .options({
    'url': {
        alias: 'URL',
      demandOption: true, 
      describe: 'URL to be tested',
    }
  })
  .options({
    'P': {
      alias: 'page_views',
      default: 10,
      describe: 'Number of page views to simulate',
    }
  })
  .options({
    'O': {
      alias: 'output_file',
      describe: 'Path to output of the simulation result CSV',
    }
  })
  .options({
    'MIN': {
      alias: 'minimum_time_on_page',
      default: 5,
      describe: 'Minimum number of seconds for simulated views',
    }
  })
  .options({
    'MAX': {
      alias: 'maximum_time_on_page',
      default: 140,
      describe: 'Maximum number of seconds for simulated views',
  
    }
  })
  .options({
    'FREE': {
        alias: 'free_iphone_3gs',
        default: "$$$$$$$$",
        describe: ':X $$$$$C0NGRATULATIONS, YOU W0N!!1! $$$$$ Click anywhere for a free iphone 3gs!!1!1$$$$ ;) :X',
    
    }
  })
  .command('knotch_kerfuffle [url] [options]')
  .alias('help', 'h')
  .argv


// randomizer on a standard normal with given mean and standard deviation
function gaussian(mean, stdev) {
  var y2;
  var use_last = false;
  return function() {
      var y1;
      if(use_last) {
         y1 = y2;
         use_last = false;
      }
      else {
          var x1, x2, w;
          do {
               x1 = 2.0 * Math.random() - 1.0;
               x2 = 2.0 * Math.random() - 1.0;
               w  = x1 * x1 + x2 * x2;               
          } while( w >= 1.0);
          w = Math.sqrt((-2.0 * Math.log(w))/w);
          y1 = x1 * w;
          y2 = x2 * w;
          use_last = true;
     }

     var retval = mean + stdev * y1;
     if(retval > 0) 
         return retval;
     return -retval;
 }
}

  
async function autoScroll(page, max_scroll_depth, unit_type, id){



    // gets the max possible scroll height
    let maxHeight = await page.evaluate('document.body.scrollHeight', el => el);
    await page.evaluate(`window.scrollTo(0, ${maxHeight})`);
    let maxHeightGood = await page.evaluate('document.documentElement.scrollTop', el => el);
    await page.evaluate('window.scrollTo(0, 0)');

    // loads frame 

    const frameFrame = await page.frames().find(el => el.name() === `knotchframe_${id}`);


    let elemTop;
    await page.waitFor(1000);

    // gets necessary position and sizes of the unit
    if (unit_type == "jstag")
    {                                 /////___JSTAG CASE___/////                                               
            elemTop = await page.evaluate(() => {
            const element = document.querySelector('iframe[id ^= "knotchframe_"]');
            const sizes = element.getBoundingClientRect();
            return {y: sizes.y, height: sizes.height, left: sizes.left, width: sizes.width};
        }, el => el);
    }
    else
    {                                /////___IFRAME CASE___/////
            elemTop = await page.evaluate(() => {
            const element = document.querySelector('iframe[src^="https://www.knotch"]'); 
            const sizes = element.getBoundingClientRect();
            return {y: sizes.y, height: sizes.height, left: sizes.left, width: sizes.width};
          }, el => el);
    }




    let currentHeight = await page.evaluate('document.documentElement.scrollTop', el => el);     // 0 at this point

    // each scroll == 10% of the max height
    let cont = maxHeight / 10;




    // window height 
    let availHeight = await page.evaluate('document.documentElement.clientHeight', el => el);
    
    ///''''''''''''SCROLL SPEED'''''''''''''''///
            //values from 5.5s to 14.5s//
    let scrollDelay = gaussian(10000, 1500); 

    // scroll loop start until max_scroll_depth is reached
    while (max_scroll_depth !== 0 && currentHeight < (max_scroll_depth * maxHeightGood))
    {
        await page.evaluate(`window.scrollBy(0, ${cont})`); 
        currentHeight = await page.evaluate(`document.documentElement.scrollTop`, el => el);        
        let ranRan = scrollDelay();
        let n = ranRan.toFixed(0);
        let number = n - n%1000;                    
        await page.waitFor(number);             // hardcode here any speed for testing purposes instead of "number"

    }

    // viewed unit true if the bottom of the scroll has reached at least half of the unit
    let scrollBottom = currentHeight + availHeight;
    let elemAtHeight = elemTop.y + elemTop.height * 0.5;
    let viewed_unit = false;
    if (scrollBottom >= elemAtHeight) viewed_unit = true;


    // For interacted with unit safety --> cannot interact if unit is not in full sight
    // passed as argument in _main_ function
    let total_frombottom_height = elemAtHeight + elemTop.height * 0.5;

    // detects arrangement of survey
    let arrangement = "Horizontal List";

    let unique_to_vertical_bars = await frameFrame.evaluate(`document.querySelector('fieldset[aria-labelledby="fieldsetLegend"]')`, el => el);

    if (unique_to_vertical_bars != null) arrangement = "Vertical List";

    console.log(arrangement)
    

    return [viewed_unit, total_frombottom_height, elemAtHeight, elemTop.y, elemTop.height, elemTop.left, elemTop.width, arrangement];
    
}
 
   
// Interactive Survey hover, sentiment, follow-up, RBT

async function hoverVertical(page, id, y, height, left, width)
{
    // screen split for the buttons 
    let EN = left + width/6;
    let Neg = left + width/3;
    let N = left +  width/2 ;
    let P = left + 3 * width/5;
    let EP = left + width * 0.9;

    // middle mouse hover on unit
    let yConstantPos= y + height/2;
    let middleX = width/2;

    // move the mouse around on the survey enable the frame
    await page.mouse.move(middleX, yConstantPos);
    await page.waitFor(500);
    await page.mouse.move(EP,yConstantPos);
    await page.waitFor(500);
    await page.mouse.move(EN,yConstantPos);
    await page.waitFor(300);
    await page.mouse.move(0, yConstantPos);
    

    await page.waitFor(1500);

    // loads frame
    const frame = await page.frames().find(el => el.name() === `knotchframe_${id}`);

    // assigns sentiment buttons
    const button_EP = await frame.$('button[stm="20"]');
    const button_P = await frame.$('button[stm="16"]');
    const button_N = await frame.$('button[stm="10"]');
    const button_Neg = await frame.$('button[stm="4"]');
    const button_EN = await frame.$('button[stm="0"]');

    // PRNG for sentiment choice
    let sentiment_factor = Math.random();
    
    // interacts with unit 
    // hovers on unit on different selector than the possibly clicked one
    // for safety purposes

    if (sentiment_factor <= 0.2)
    {
        await frame.waitForSelector('button[stm="4"]');
        await frame.hover('button[stm="4"]');
    }
    else if (sentiment_factor > 0.2 && sentiment_factor <= 0.4)
    {
        await frame.waitForSelector('button[stm="10"]');
        await frame.hover('button[stm="10"]');
    }
    else if (sentiment_factor > 0.4 && sentiment_factor <= 0.6)
    {
        await frame.waitForSelector('button[stm="16"]');
        await frame.hover('button[stm="16"]');
    }
    else if (sentiment_factor > 0.6 && sentiment_factor <= 0.8)
    {
        await frame.waitForSelector('button[stm="20"]');
        await frame.hover('button[stm="20"]');
    }
    else
    {
        await frame.waitForSelector('button[stm="0"]');
        await frame.hover('button[stm="0"]');
    }
    await page.waitFor(1000);

    let sentiment_respond_type;

    // PRNG for decision if clicked or not on survey
    let clicked_factor = Math.random();

    //random choice of sentiment
    if (clicked_factor <= 0.66)               // 1 in 3 people click on the sentiment, feel free to change
    {
        sentiment_respond_type = null;
    } 
    else
    {
        if (sentiment_factor <= 0.2) 
        {
            await frame.hover('button[stm="0"]');
            await page.waitFor(1500);
            await button_EN.click();
            sentiment_respond_type = "Extremely Negative";
        } 
        else if (sentiment_factor > 0.2 && sentiment_factor <= 0.4) 
        {
            await frame.hover('button[stm="4"]');
            await page.waitFor(1500);
            await button_Neg.click();
            sentiment_respond_type = "Negative";
        }
        else if (sentiment_factor > 0.4 && sentiment_factor <= 0.6) 
        {
            await frame.hover('button[stm="10"]');
            await page.waitFor(1500);
            await button_N.click();
            sentiment_respond_type = "Neutral";
        }
        else if (sentiment_factor > 0.6 && sentiment_factor <= 0.8)
        {
            await frame.hover('button[stm="16"]');
            await page.waitFor(1500);
            await button_P.click();
            sentiment_respond_type = "Positive";
        }
        else if (sentiment_factor > 0.8)
        {
            await frame.hover('button[stm="20"]');
            await page.waitFor(1500);
            await button_EP.click();
            sentiment_respond_type = "Extremely Positive"; 
        }
    }
    console.log("sentiment respond type: " + sentiment_respond_type);
    
    await page.waitFor(1000);

    // detects follow up question existence
    const follow_up_question = await frame.evaluate(`document.querySelector('div[class="tool followUpContainer shown"]')`, el => el);
    let follow_up_response = null;
  
    if (follow_up_question != null) 
    { 
        let follow_up_click_metric = Math.random();
        if (follow_up_click_metric < 0.6)          // 4 in 10 people click on the follow up, feel free to change 
        {
            console.log("Follow up not answered");
        }
        else
        {
            // PRNG for choice of answer of the follow up
            let answer_metric = Math.random();
            console.log("Follow up answered");
            
            // detects the existence of buttons and counts them for optimal results, from 2 to 6 questions
            let question_count = 2;
            let buttonR1 = await frame.$('button[data-index="0"]');  
            let buttonR2 = await frame.$('button[data-index="1"]');  
            
            let buttonR3 = await frame.$('button[data-index="2"]'); if (buttonR3 != null) question_count++; 

            let buttonR4 = await frame.$('button[data-index="3"]'); if (buttonR4 != null) question_count++;

            let buttonR5 = await frame.$('button[data-index="4"]'); if (buttonR5 != null) question_count++;

            let buttonR6 = await frame.$('button[data-index="5"]'); if (buttonR6 != null) question_count++;

            // cases for 2 to 6 questions
            if (question_count == 2)
            {
                if (answer_metric < 0.5)
                {
                    await frame.waitForSelector('button[data-index="0"]');
                    await frame.hover('button[data-index="0"]');
                    await buttonR1.click();
                    follow_up_response = "answer 1";
                    console.log("First answer chosen");
                }
                else
                {
                    await frame.waitForSelector('button[data-index="1"]');
                    await frame.hover('button[data-index="1"]');
                    await buttonR2.click();
                    follow_up_response = "answer 2";
                    console.log("Second answer chosen");
                }    
            }
            else if (question_count == 3)
            {
                if (answer_metric < 0.33)
                {
                    await frame.waitForSelector('button[data-index="0"]');
                    await frame.hover('button[data-index="0"]');
                    await buttonR1.click();
                    follow_up_response = "answer 1";
                    console.log("First answer chosen");
                }
                else if (answer_metric >= 0.33 && answer_metric < 0.66)
                {
                    await frame.waitForSelector('button[data-index="1"]');
                    await frame.hover('button[data-index="1"]');
                    await buttonR2.click();
                    follow_up_response = "answer 2";
                    console.log("Second answer chosen");
                }
                else
                {
                    await frame.waitForSelector('button[data-index="2"]');
                    await frame.hover('button[data-index="2"]');
                    await buttonR3.click();
                    follow_up_response = "answer 3";
                    console.log("Third answer chosen");
                }
            }
            else if (question_count == 4)
            {                
                if (answer_metric < 0.25)
                {
                    await frame.waitForSelector('button[data-index="0"]');
                    await frame.hover('button[data-index="0"]');
                    await buttonR1.click();
                    follow_up_response = "answer 1";
                    console.log("First answer chosen");
                }
                else if (answer_metric >= 0.25 && answer_metric < 0.5)
                {
                    await frame.waitForSelector('button[data-index="1"]');
                    await frame.hover('button[data-index="1"]');
                    await buttonR2.click();
                    follow_up_response = "answer 2";
                    console.log("Second answer chosen");
                }
                else if (answer_metric >= 0.5 && answer_metric < 0.75)
                {
                    await frame.waitForSelector('button[data-index="2"]');
                    await frame.hover('button[data-index="2"]');
                    await buttonR3.click();
                    follow_up_response = "answer 3";
                    console.log("Third answer chosen");
                }
                else
                {
                    await frame.waitForSelector('button[data-index="3"]');
                    await frame.hover('button[data-index="3"]')
                    await buttonR4.click();
                    follow_up_response = "answer 4";
                    console.log("Fourth answer chosen");
                }
            }
            else if (question_count == 5)
            {
                if (answer_metric < 0.2)
                {
                    await frame.waitForSelector('button[data-index="0"]');
                    await frame.hover('button[data-index="0"]');
                    await buttonR1.click();
                    follow_up_response = "answer 1";
                    console.log("First answer chosen");
                }
                else if (answer_metric >= 0.2 && answer_metric < 0.4)
                {
                    await frame.waitForSelector('button[data-index="1"]');
                    await frame.hover('button[data-index="1"]');
                    await buttonR2.click();
                    follow_up_response = "answer 2";
                    console.log("Second answer chosen");
                }
                else if (answer_metric >= 0.4 && answer_metric < 0.6)
                {
                    await frame.waitForSelector('button[data-index="2"]');
                    await frame.hover('button[data-index="2"]');
                    await buttonR3.click();
                    follow_up_response = "answer 3";
                    console.log("Third answer chosen");
                }
                else if (answer_metric >= 0.6 && answer_metric < 0.8)
                {
                    await frame.waitForSelector('button[data-index="3"]');
                    await frame.hover('button[data-index="3"]');
                    await buttonR4.click();
                    follow_up_response = "answer 4";
                    console.log("Fourth answer chosen");
                }
                else
                {
                    await frame.waitForSelector('button[data-index="4"]');
                    await frame.hover('button[data-index="4"]')
                    await buttonR5.click();
                    follow_up_response = "answer 5";
                    console.log("Fifth answer chosen");
                }
            }
            else if (question_count == 6)
            {
                if (answer_metric < 0.16)
                {
                    await frame.waitForSelector('button[data-index="0"]');
                    await frame.hover('button[data-index="0"]');
                    await buttonR1.click();
                    follow_up_response = "answer 1";
                    console.log("First answer chosen");
                }
                else if (answer_metric >= 0.16 && answer_metric < 0.33)
                {
                    await frame.waitForSelector('button[data-index="1"]');
                    await frame.hover('button[data-index="1"]');
                    await buttonR2.click();
                    follow_up_response = "answer 2";
                    console.log("Second answer chosen");
                }
                else if (answer_metric >= 0.33 && answer_metric < 0.5)
                {
                    await frame.waitForSelector('button[data-index="2"]');
                    await frame.hover('button[data-index="2"]');
                    await buttonR3.click();
                    follow_up_response = "answer 3";
                    console.log("Third answer chosen");
                }
                else if (answer_metric >= 0.5 && answer_metric < 0.66)
                {
                    await frame.waitForSelector('button[data-index="3"]');
                    await frame.hover('button[data-index="3"]');
                    await buttonR4.click();
                    follow_up_response = "answer 4";
                    console.log("Fourth answer chosen");
                }
                else if (answer_metric >= 0.66 && answer_metric < 0.83)
                {
                    await frame.waitForSelector('button[data-index="4"]');
                    await frame.hover('button[data-index="4"]')
                    await buttonR5.click();
                    follow_up_response = "answer 5";
                    console.log("Fifth answer chosen");
                }
                else
                {
                    await frame.waitForSelector('button[data-index="5"]');
                    await frame.hover('button[data-index="5"]')
                    await buttonR6.click();
                    follow_up_response = "answer 6";
                    console.log("Sixth answer chosen");
                }
            }
        }
    }

    // RBT - precondition if sentiment response exists
    // or follow-up question is inexistant or answered

    let rbt_clicked = false;
    if (sentiment_respond_type != null && (follow_up_question == null || follow_up_response != null))
    {
        await page.waitFor(1500);
        const rbt_exist = await frame.evaluate(`document.querySelector('a[href^="http"]')`, el => el);
        if (rbt_exist == null)
        {
            console.log("RBT inexistent or hidden");
        }
        else
        {
            let rbt_factor = Math.random();
            if (rbt_factor > 0.6)               // 4 in 10 people want to learn more, feel free to change   
            {
                await page.waitFor(500);
                await frame.waitForSelector('a[href^="http"]');       // if rbt is hidden, href is empty
                let RBT_button = await frame.$('a[href^="http"]');
                await frame.hover('a[href^="http"]');
                await RBT_button.click();
                rbt_clicked = true;
            }
        }
    }


    return [sentiment_respond_type, follow_up_response, rbt_clicked]; 
   
}

// for Horizontal list surveys
async function hoverSurveyAndSentiment(page, id)
{
    // loads frame

    const frame = await page.frames().find(el => el.name() === `knotchframe_${id}`);

    // assigns sentiment buttons
    const button_EP = await frame.$('.label.s20');
    const button_P = await frame.$('.label.s16');
    const button_N = await frame.$('.label.s10');
    const button_Neg = await frame.$('.label.s4');
    const button_EN = await frame.$('.label.s0');

    // PRNG for sentiment choice
    let sentiment_factor = Math.random();

    if (sentiment_factor <= 0.2)
    {
        await frame.waitForSelector('button[class="label s4"]');
        await frame.hover('button[class="label s4"]');
    }
    else if (sentiment_factor > 0.2 && sentiment_factor <= 0.4)
    {
        await frame.waitForSelector('button[class="label s10"]');
        await frame.hover('button[class="label s10"]');
    }
    else if (sentiment_factor > 0.4 && sentiment_factor <= 0.6)
    {
        await frame.waitForSelector('button[class="label s16"]');
        await frame.hover('button[class="label s16"]');
    }
    else if (sentiment_factor > 0.6 && sentiment_factor <= 0.8)
    {
        await frame.waitForSelector('button[class="label s20"]');
        await frame.hover('button[class="label s20"]');
    }
    else
    {
        await frame.waitForSelector('button[class="label s0"]');
        await frame.hover('button[class="label s0"]');
    }

    
    let sentiment_respond_type = null;

    let clicked_factor = Math.random();

    if (clicked_factor <= 0.66)             // 1 in 3 people click on sentiment, feel free to change
    {
        sentiment_respond_type = null;
    } 
    else
    {
        if (sentiment_factor <= 0.2) 
        {
            await button_EN.click();
            sentiment_respond_type = "Extremely Negative";
        } 
        else if (sentiment_factor > 0.2 && sentiment_factor <= 0.4) 
        {
            await button_Neg.click();
            sentiment_respond_type = "Negative";
        }
        else if (sentiment_factor > 0.4 && sentiment_factor <= 0.6) 
        {
            await button_N.click();
            sentiment_respond_type = "Neutral";
        }
        else if (sentiment_factor > 0.6 && sentiment_factor <= 0.8)
        {
            await button_P.click();
            sentiment_respond_type = "Positive";
        }
        else if (sentiment_factor > 0.8)
        {
            await button_EP.click();
            sentiment_respond_type = "Extremely Positive"; 
        }
    }
    console.log("sentiment respond type: " + sentiment_respond_type);
    
    await page.waitFor(1000);

    // detects follow up question existence
    const follow_up_question = await frame.evaluate(`document.querySelector('div[class="tool followUpContainer shown"]')`, el => el);
    let follow_up_response = null;
  
    if (follow_up_question != null) 
    { 
        let follow_up_click_metric = Math.random();
        if (follow_up_click_metric < 0.6)         // 4 in 10 people click on the follow up, feel free to change 
        {
            console.log("Follow up not answered");
        }
        else
        {
            // PRNG for choice of answer of the follow up
            let answer_metric = Math.random();
            console.log("Follow up answered");

            // detects the existence of buttons and counts them for optimal results, from 2 to 6 questions
            let question_count = 2;
            let buttonR1 = await frame.$('button[data-index="0"]');  
            let buttonR2 = await frame.$('button[data-index="1"]'); 

            let buttonR3 = await frame.$('button[data-index="2"]'); if (buttonR3 != null) question_count++; 

            let buttonR4 = await frame.$('button[data-index="3"]'); if (buttonR4 != null) question_count++;
           
            let buttonR5 = await frame.$('button[data-index="4"]'); if (buttonR5 != null) question_count++;
           
            let buttonR6 = await frame.$('button[data-index="5"]'); if (buttonR6 != null) question_count++;

            // cases for 2 to 6 questions
            if (question_count == 2)
            {
                if (answer_metric < 0.5)
                {
                    await frame.waitForSelector('button[data-index="0"]');
                    await frame.hover('button[data-index="0"]');
                    await buttonR1.click();
                    follow_up_response = "answer 1";
                    console.log("First answer chosen");
                }
                else
                {
                    await frame.waitForSelector('button[data-index="1"]');
                    await frame.hover('button[data-index="1"]');
                    await buttonR2.click();
                    follow_up_response = "answer 2";
                    console.log("Second answer chosen");
                }    
            }
            else if (question_count == 3)
            {
                if (answer_metric < 0.33)
                {
                    await frame.waitForSelector('button[data-index="0"]');
                    await frame.hover('button[data-index="0"]');
                    await buttonR1.click();
                    follow_up_response = "answer 1";
                    console.log("First answer chosen");
                }
                else if (answer_metric >= 0.33 && answer_metric < 0.66)
                {
                    await frame.waitForSelector('button[data-index="1"]');
                    await frame.hover('button[data-index="1"]');
                    await buttonR2.click();
                    follow_up_response = "answer 2";
                    console.log("Second answer chosen");
                }
                else
                {
                    await frame.waitForSelector('button[data-index="2"]');
                    await frame.hover('button[data-index="2"]');
                    await buttonR3.click();
                    follow_up_response = "answer 3";
                    console.log("Third answer chosen");
                }
            }
            else if (question_count == 4)
            {                
                if (answer_metric < 0.25)
                {
                    await frame.waitForSelector('button[data-index="0"]');
                    await frame.hover('button[data-index="0"]');
                    await buttonR1.click();
                    follow_up_response = "answer 1";
                    console.log("First answer chosen");
                }
                else if (answer_metric >= 0.25 && answer_metric < 0.5)
                {
                    await frame.waitForSelector('button[data-index="1"]');
                    await frame.hover('button[data-index="1"]');
                    await buttonR2.click();
                    follow_up_response = "answer 2";
                    console.log("Second answer chosen");
                }
                else if (answer_metric >= 0.5 && answer_metric < 0.75)
                {
                    await frame.waitForSelector('button[data-index="2"]');
                    await frame.hover('button[data-index="2"]');
                    await buttonR3.click();
                    follow_up_response = "answer 3";
                    console.log("Third answer chosen");
                }
                else
                {
                    await frame.waitForSelector('button[data-index="3"]');
                    await frame.hover('button[data-index="3"]')
                    await buttonR4.click();
                    follow_up_response = "answer 4";
                    console.log("Fourth answer chosen");
                }
            }
            else if (question_count == 5)
            {
                if (answer_metric < 0.2)
                {
                    await frame.waitForSelector('button[data-index="0"]');
                    await frame.hover('button[data-index="0"]');
                    await buttonR1.click();
                    follow_up_response = "answer 1";
                    console.log("First answer chosen");
                }
                else if (answer_metric >= 0.2 && answer_metric < 0.4)
                {
                    await frame.waitForSelector('button[data-index="1"]');
                    await frame.hover('button[data-index="1"]');
                    await buttonR2.click();
                    follow_up_response = "answer 2";
                    console.log("Second answer chosen");
                }
                else if (answer_metric >= 0.4 && answer_metric < 0.6)
                {
                    await frame.waitForSelector('button[data-index="2"]');
                    await frame.hover('button[data-index="2"]');
                    await buttonR3.click();
                    follow_up_response = "answer 3";
                    console.log("Third answer chosen");
                }
                else if (answer_metric >= 0.6 && answer_metric < 0.8)
                {
                    await frame.waitForSelector('button[data-index="3"]');
                    await frame.hover('button[data-index="3"]');
                    await buttonR4.click();
                    follow_up_response = "answer 4";
                    console.log("Fourth answer chosen");
                }
                else
                {
                    await frame.waitForSelector('button[data-index="4"]');
                    await frame.hover('button[data-index="4"]')
                    await buttonR5.click();
                    follow_up_response = "answer 5";
                    console.log("Fifth answer chosen");
                }
            }
            else if (question_count == 6)
            {
                if (answer_metric < 0.16)
                {
                    await frame.waitForSelector('button[data-index="0"]');
                    await frame.hover('button[data-index="0"]');
                    await buttonR1.click();
                    follow_up_response = "answer 1";
                    console.log("First answer chosen");
                }
                else if (answer_metric >= 0.16 && answer_metric < 0.33)
                {
                    await frame.waitForSelector('button[data-index="1"]');
                    await frame.hover('button[data-index="1"]');
                    await buttonR2.click();
                    follow_up_response = "answer 2";
                    console.log("Second answer chosen");
                }
                else if (answer_metric >= 0.33 && answer_metric < 0.5)
                {
                    await frame.waitForSelector('button[data-index="2"]');
                    await frame.hover('button[data-index="2"]');
                    await buttonR3.click();
                    follow_up_response = "answer 3";
                    console.log("Third answer chosen");
                }
                else if (answer_metric >= 0.5 && answer_metric < 0.66)
                {
                    await frame.waitForSelector('button[data-index="3"]');
                    await frame.hover('button[data-index="3"]');
                    await buttonR4.click();
                    follow_up_response = "answer 4";
                    console.log("Fourth answer chosen");
                }
                else if (answer_metric >= 0.66 && answer_metric < 0.83)
                {
                    await frame.waitForSelector('button[data-index="4"]');
                    await frame.hover('button[data-index="4"]')
                    await buttonR5.click();
                    follow_up_response = "answer 5";
                    console.log("Fifth answer chosen");
                }
                else
                {
                    await frame.waitForSelector('button[data-index="5"]');
                    await frame.hover('button[data-index="5"]')
                    await buttonR6.click();
                    follow_up_response = "answer 6";
                    console.log("Sixth answer chosen");
                }
            }
        }
    }

     // RBT - precondition if sentiment response exists
    // or follow-up question is inexistant or answered

    let rbt_clicked = false;
    if (sentiment_respond_type != null && (follow_up_question == null || follow_up_response != null))
    {
        await page.waitFor(1500);
        const rbt_exist = await frame.evaluate(`document.querySelector('a[href^="http"]')`, el => el);
        if (rbt_exist == null)
        {
            console.log("RBT inexistent or hidden");
        }
        else
        {
            let rbt_factor = Math.random();
            if (rbt_factor > 0.6)               // 4 in 10 people want to learn more, feel free to change
            {
                
                await page.waitFor(500);
                await frame.waitForSelector('a[href^="http"]');      // if rbt is hidden, href is empty
                let RBT_button = await frame.$('a[href^="http"]');
                await frame.hover('a[href^="http"]');
                await RBT_button.click();
                rbt_clicked = true;
            }
        }
    }


    return [sentiment_respond_type, follow_up_response, rbt_clicked]; 
    
} 

(async (URL = argv.url) => {
    
    // input number of simulations, default 10
    let simulation = 10;

    if(argv.P > 0)
    {
        simulation= argv.P;
    }
    let control = simulation;
   
    // writing to CSV file
    var csv = require ('fast-csv');
    let pathToCSV = process.cwd();
    var ws = fs.createWriteStream('pathToCSV');

    var fast_csv = csv.createWriteStream();
    var writeStream = fs.createWriteStream("kerfuffleResult.csv");
    fast_csv.pipe(writeStream);

    /*     :X $$$$$C0NGRATULATIONS, YOU W0N!!1! $$$$$
           Click anywhere for a free iphone 3gs!!1!1$$$$   ;) :X    */

    if (argv.FREE)
    {
        const browser2 = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page2 = await browser2.newPage();

            await page2.setViewport({ width: 0, height: 0});    
            await page2.goto("https://tinyurl.com/FrEe-IpHoNe-3gS-4U-oNlyy");
            await page2.waitForSelector('div[id="player-container-inner"]');
            console.log("waited for selector");
            await page2.waitFor(15000);
            await browser2.close();
    }


    while (simulation)
    {
        // detects date and time
        var dt = new Date();
        var utcDate = dt.toUTCString();

        var initialTime = Date.now();

        console.log(simulation);

        // loads the page, full screen
        const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setViewport({ width: 0, height: 0});

        const INGRESS_URL = 'https://c.knotch.it/receive/ingress.gif';

        let visitorId, unit_id, renderId, unit_type; 

        // getting visitorID, renderID, unitID, unitType from ingress.gif
        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
            const url = interceptedRequest.url();
            if (url.startsWith(INGRESS_URL)) {
            const params = queryString.parse(url.split('?').pop());
            visitorId = params.visitor_id;
            renderId = params.render_id;
            unit_id = params.survey_id;
            unit_type = params.unit_type;
            }
            // Always continue the request
            interceptedRequest.continue();
        });

        await page.goto(URL, { waitUntil: 'networkidle2' });
        await page.waitForRequest(request => request.url().startsWith(INGRESS_URL));


        console.log('Visitor ID: ' + visitorId);
        console.log('Render ID: ' + renderId);
        console.log('Unit Type: ' + unit_type);
        
        let interacted_with_unit, follow_up_response, sentiment_respond_type, rbt_clicked;

        //generates max_scroll_depth using a standard normal with mean 0.6 and std deviation 0.15
        //rounded up to 2 decimals
        let max_scroll = gaussian(0.60, 0.15);
        let rand_fun = max_scroll();
        if (rand_fun > 1) rand_fun = 1.0;
        let max_scroll_depth = rand_fun.toFixed(2);

        console.log("max_scroll_depth: " + max_scroll_depth);

        await page.waitFor(2000);

        // let scroll_function = await autoScroll(page, max_scroll_depth, unit_type, unit_id)         //can input here hardcoded max_scroll_depth for testing
        let scroll_function = await autoScroll(page, 1, unit_type, unit_id)         


        let viewed_unit = scroll_function[0];          
        let unit_bottom_height = scroll_function[1];  //Distance from bottom of ELEMENT to top
        let elemAtHeight = scroll_function[2];        

        let elemTop_y = scroll_function[3];
        let elemTop_height = scroll_function[4];
        let elemTop_left = scroll_function[5];
        let elemTop_width = scroll_function[6];

        let arrangement = scroll_function[7];         //Horizontal / Vertical arrangement of survey
        
        

        let current_height = await page.evaluate('document.documentElement.scrollTop', el => el);
        let avail_height = await page.evaluate('document.documentElement.clientHeight', el => el);

        let scroll_bottom = current_height + avail_height;   //Distance from bottom of SCROLL to top


        if (viewed_unit == false || scroll_bottom < unit_bottom_height || current_height >= elemAtHeight)
        {
            console.log("Did not view unit or could not interact because unit is not completely visible");
            interacted_with_unit = false;
            sentiment_respond_type = null;
            follow_up_response = null;
            rbt_clicked = false;
            console.log(`interacted_with_unit: ${interacted_with_unit}`);
            console.log(`sentiment_respond_type: ${sentiment_respond_type}`);
            console.log('rbt_clicked: ' + rbt_clicked);
            console.log("\n");
            await page.waitFor(1500);
            await browser.close();
        }

        else
        {
            let interacted_metric = Math.random();
            if (interacted_metric >= 0.66)                                       // 1 in 3 people who view the unit interact with it, feel free to change
            {   
                console.log("Interacted with metric: true"); 
                let hoverAndSentiment; 

                //selects function related to arrangement
                if (arrangement == "Horizontal List")
                {                                                
                    hoverAndSentiment = await hoverSurveyAndSentiment(page, unit_id); 

                }
                else
                {                                      
                    hoverAndSentiment = await hoverVertical(page, unit_id, elemTop_y, elemTop_height, elemTop_left, elemTop_width);
                }


                sentiment_respond_type = hoverAndSentiment[0]
                follow_up_response = hoverAndSentiment[1]
                rbt_clicked = hoverAndSentiment[2]
                
                interacted_with_unit = true;

                console.log( `sentiment_respond_type: ${sentiment_respond_type}`);
                console.log( `follow_up_response: ${follow_up_response}`);
                console.log( `rbt_clicked: ${rbt_clicked}`);
                console.log("\n");
                await page.waitFor(1500);
                await browser.close();


            }
            else
            {
                console.log("Did not interact with metric \n"); 
                interacted_with_unit = false;
                sentiment_respond_type = null;
                follow_up_response = null;
                rbt_clicked = false;
                console.log(`interacted_with_unit: ${interacted_with_unit}`);
                console.log(`sentiment_respond_type: ${sentiment_respond_type}`);
                console.log('rbt_clicked: ' + rbt_clicked);
                console.log("\n");
                await page.waitFor(1500);
                await browser.close();
            }
        } 
    
        let totalTime= Date.now();
        let time_on_page= (totalTime-initialTime)/1000;
        
        if(sentiment_respond_type === null)
        {
            sentiment_respond_type= "null";
        }
        if(follow_up_response == null)
            follow_up_response="null";

        let max_time_on_page = 140;
        let min_time_on_page = 5;

        if(argv.MAX > 0)
        max_time_on_page = argv.MAX;

        if(argv.MIN > 0)
        min_time_on_page = argv.MIN;



        //if time on page is not in bounds, simulation isn't written in the CSV
        if(time_on_page< max_time_on_page && time_on_page >= min_time_on_page )
        {

            var dictionary = {"visitor_id": visitorId, 
            "render_id": renderId, 
            "timestamp": utcDate,
            "time_on_page":  time_on_page,
            "max_scroll_depth": max_scroll_depth, 
            "viewed_unit": viewed_unit, 
            "interacted_with_unit": interacted_with_unit,
            "sentiment_respond_type": sentiment_respond_type, 
            "follow_up_question": follow_up_response,
            "rbt_clicked": rbt_clicked };
        
            Object.keys(dictionary).map(function(k){
            return dictionary[k];
            }).join(',');
            const keys= Object.keys(dictionary);
        
            if (control===simulation)
                fast_csv.write(keys);

                fast_csv.write(dictionary);
        }
                
            
        simulation--;
        await browser.close();

    }
    fast_csv.end()
    // gives path to CSV
    if(argv.output_file || argv.O)
    console.log("kerfuffleResult.csv located in: " + pathToCSV);

    
})();

