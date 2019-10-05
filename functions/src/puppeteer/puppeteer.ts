import * as puppeteer from 'puppeteer';
import { publicFirestore } from '../db';
import { PublicCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { Webpage } from '../../../shared-models/ssr/webpage.model';
import { now } from 'moment';
import { WebpageRequestType } from '../../../shared-models/ssr/webpage-request-type.model';
import { PuppeteerResponse } from '../../../shared-models/ssr/puppeteer-response';
import { createOrReverseFirebaseSafeUrl } from '../global-helpers';
import { metaTagDefaults } from '../../../shared-models/analytics/metatags.model';
const db = publicFirestore;

// Courtesy of: https://developers.google.com/web/tools/puppeteer/articles/ssr
// With additional tips from: https://medium.com/@ebidel/puppeteering-in-firebase-google-cloud-functions-76145c7662bd


const updateHtml = (html: string, docTarget: string, textToAdd: string): string => {
  const startIndex = html.indexOf(docTarget) + docTarget.length;
  const updatedHtml = html.slice(0, startIndex) + ` ${textToAdd}` + html.slice(startIndex);
  return updatedHtml;
}

// Applied before storing in database
const tagCacheInHtml = (html: string): string => {
  const docTarget = '<head>';
  const cacheTag = `<meta name="${metaTagDefaults.maryDaphnePublic.metaTagCachedHtml}" content="true">`;
  const updatedHtml = updateHtml(html, docTarget, cacheTag);
  console.log('Marking cache in HTML');
  return updatedHtml;
}

// Applied after retrieving from database
const tagBotInHtml = (html: string): string => {
  const docTarget = '<head>';
  const botTag = `<meta name="${metaTagDefaults.maryDaphnePublic.metaTagIsBot}" content="true">`;
  const updatedHtml = updateHtml(html, docTarget, botTag);
  console.log('Marking bot in HTML');
  return updatedHtml;
}

// Store cache in Firebase for rapid access
const cachePage = async (url: string, userAgent: string, html: string) => {
  
  const fbSafeUrl: string = createOrReverseFirebaseSafeUrl(url);

  const updatedHtml = tagCacheInHtml(html); // Add a cache tag to the HTML doc in the head section

  const webpage: Webpage = {
    expires: now() + (1000 * 60 * 60 * 24 * 7), // Set expiry for seven days
    userAgent,
    payload: updatedHtml,
    saved: now(),
    url: createOrReverseFirebaseSafeUrl(fbSafeUrl, true) // Revert to normal url
  }
  
  const fbRes = await db.collection(PublicCollectionPaths.PUBLIC_SITE_CACHE).doc(fbSafeUrl).set(webpage)
    .catch(error => {
      console.log('Error connecting to firebase', error);
      return error;
    });
    console.log('Web page cached');
    return fbRes;
}

// Retrieve cached page from Firebase
const retrieveCachedPage = async (url: string, isBot: boolean): Promise<Webpage | undefined> => {
  const fbSafeUrl = createOrReverseFirebaseSafeUrl(url);
  console.log('Attempting to retrieve cached page with id: ', fbSafeUrl);
  const pageDoc: FirebaseFirestore.DocumentSnapshot = await db.collection(PublicCollectionPaths.PUBLIC_SITE_CACHE).doc(fbSafeUrl).get()
    .catch(error => {
      console.log('Error fetching cached page doc', error)
      return error;
    });
  if (pageDoc.exists) {
    const webPageData = pageDoc.data() as Webpage;
    console.log('Cached page exists', webPageData);
    
    // If a bot is accessing page, indicate that in the html
    if (isBot) {
      webPageData.payload = tagBotInHtml(webPageData.payload);
    }
    return webPageData;
  }

  console.log('No cached page found');
  return undefined;
}


// This listener intercepts all incoming requests to screen out unwanted behavior
const interceptRequest = async (page: puppeteer.Page) => {
  console.log('Attempting to intercept requests before loading page');
  // 1. Intercept network requests.
  await page.setRequestInterception(true);

  // TODO: SEE IF I CAN INTERCEPT THE LINGERING FIRESTORE XHR REQUEST THAT TAKES FOREVER TO RUN
  page.on('request', req => {
    // 2. Ignore requests for resources that don't produce DOM
    // (images, stylesheets, media).
    const whitelist = ['document', 'script', 'xhr', 'fetch'];
    if (!whitelist.includes(req.resourceType())) {
      return req.abort();
    }

    // Block GA requests as well as other unecessary requests
    const blacklist = ['www.google-analytics.com', '/gtag/js', 'ga.js', 'analytics.js', 'gtm.js', 'stripe.com', 'youtube.com', 'doubleclick.net', 'stripe.network'];
    let blacklistItem;
    if (blacklist.find(regex => {
      blacklistItem = req.url().match(regex);
      return req.url().match(regex) as any;
    })) {
      console.log('Preventing google analytics request', blacklistItem);
      return req.abort();
    }

    // 3. Pass through all other requests.
    return req.continue();
  });
}

// // THIS AND THE INLINERESOURCES CODE ARE NOT NECESSARY
// const stylesheetContents: any = {};

// const stashLocalStylesheets = async(url: string, page: puppeteer.Page) => {
//   console.log('Stashing local stylesheets');
//   // 1. Stash the responses of local stylesheets.
//   page.on('response', async resp => {
//     console.log('Page response detected', resp);
//     console.log('Programatic url', resp.url());
//     const responseUrl = resp.url();
//     const sameOrigin = responseUrl === url;
//     const isStylesheet = resp.request().resourceType() === 'stylesheet';
//     // const respResourceType = (resp as any)['_request']['_resourceType'] as string;
//     // const isStylesheet = respResourceType === 'stylesheet';
//     if (sameOrigin && isStylesheet) {
//       console.log('Is stylesheet');
//       stylesheetContents[responseUrl] = await resp.text();
//     }
//   });
// }

// const inlineResources = async(page: puppeteer.Page) => {
//   console.log('Attempting to inline critical resources like stylesheets');
//   // 2. Inline the CSS.
//   // Replace stylesheets in the page with their equivalent <style>.
//   await page.$$eval('link[rel="stylesheet"]', (links, content) => {
//     links.forEach(link => {
//       const thisLink = link as HTMLLinkElement; // Added for type certainty
//       const cssText = content[thisLink.href];
//       if (cssText) {
//         const style = document.createElement('style');
//         style.textContent = cssText;
//         thisLink.replaceWith(style);
//       }
//     });
//   }, stylesheetContents);
// }

const exitWithCacheResponse = (cachedPage: Webpage): PuppeteerResponse => {
  console.log('Returning cached page payload', cachedPage.payload);
    const cacheResponse: PuppeteerResponse = {
      html: cachedPage.payload,
      ttRenderMs: 0
    }
  
    return cacheResponse;
}

const exitWithEmptyResponse = () => {
  console.log('No cached page for Google bot, serving normally');
  return {html: '', ttRenderMs: 0, emptyRespnse: true};
}

/**
 * @param {string} url URL to prerender.
 * @param {express.Request} request Request being processed by the server (used for caching headers)
 * @param {WebpageRequestType} requestType Dictates how the request should be handled by puppeteer
 */

export const puppeteerSsr = async (url: string, userAgent: string, requestType: WebpageRequestType, isBot: boolean): Promise<PuppeteerResponse> => {
  
  let cachedPage;

  // Retrieve cached page if this isn't a cacheUpdate request
  if (requestType !== WebpageRequestType.AUTO_CACHE) {
    cachedPage = await retrieveCachedPage(url, isBot);
  }


  // If cached page exists, return that and end the function
  if (cachedPage) {
    return exitWithCacheResponse(cachedPage);
  }

  // If no cache and it's a Google Bot, abort with empty response and process as a human request
  if (!cachedPage && requestType === WebpageRequestType.GOOGLE_BOT) {
    return exitWithEmptyResponse();
  }

  const start = Date.now();

  
  const browser = await puppeteer.launch(
      {
        // No sandbox is required in cloud functions
        args: ['--no-sandbox'],
        defaultViewport: {
          width: 375,
          height: 667,
          isMobile: true,
          hasTouch: true
        }
      }
    );
  const page = await browser.newPage();
  
  try {

    await interceptRequest(page);

    console.log('Attempting to go to page', url);
    page.setDefaultNavigationTimeout(20000); // Set timeout to 20 seconds
    await page.goto(url, {waitUntil: 'load'});
    console.log('Found page, waiting for selector to appear');

    await page.waitForSelector('.puppeteer-loaded'); // ensure .puppeteer-loaded class exists in the DOM.

  } catch (err) {
    console.error(err);
    throw new Error('page.goto/waitForSelector timed out.');
  }

  let html = await page.content(); // serialized HTML of page DOM.
  console.log('Selector found, fetched this html', html);
  
  await browser.close(); // Close out browser to preserve memory

  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);

  // Cache HTML in database for easy future retrieval
  await cachePage(url, userAgent, html)
    .catch(error => {
      console.log('Error caching page', error);
      return error;
    });
  
  // Indicate bot in HTML response if applicable
  if (requestType === WebpageRequestType.AUTO_CACHE || isBot) {
    html = tagBotInHtml(html);
  }

  const response: PuppeteerResponse = {
    html,
    ttRenderMs
  }

  return response;
};