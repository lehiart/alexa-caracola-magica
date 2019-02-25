const alexa = require('ask-sdk');
const { phrases } = require('./constants');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'La caracola lo sabe todo, ¿Qué deseas preguntarle?';
        const repromptText = 'que deseas preguntarle?';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .withSimpleCard('', speechText)
            .getResponse();
    }
};

const AskMagicConchIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AskMagicConchIntent';
    },
    async handle(handlerInput) {
        const selected = phrases[Math.floor(Math.random() * phrases.length)];
        let speechText = `<audio src='${selected.url}'/><break time="500ms"/> ${phrases.denuevo}`;
        
        if (selected.name === 'denuevo') {
            speechText = phrases.denuevo;
        }
        
        return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(phrases.denuevo)
        .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'Puedes preguntarme lo que sea! La caracola lo sabe todo y te ayudará con un sí, no, o tal vez. ¿Qué deseas saber?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Adiós!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('', speechText)
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Lo siento no pude entenderte, intenta de nuevo.')
      .reprompt('Lo siento no pude entenderte, intenta de nuevo.')
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};


exports.handler = alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        AskMagicConchIntentHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();