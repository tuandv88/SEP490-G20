import { __decorate, __param } from 'vscode/external/tslib/tslib.es6.js';
import { localize } from 'vscode/vscode/vs/nls';
import { ExtensionsRegistry } from 'vscode/vscode/vs/workbench/services/extensions/common/extensionsRegistry';
import { getTokenClassificationRegistry, typeAndModifierIdPattern } from 'vscode/vscode/vs/platform/theme/common/tokenClassificationRegistry';
import { registerWorkbenchContribution2 } from 'vscode/vscode/vs/workbench/common/contributions';
import { IInstantiationService } from 'vscode/vscode/vs/platform/instantiation/common/instantiation';

const tokenClassificationRegistry = getTokenClassificationRegistry();
const tokenTypeExtPoint = ExtensionsRegistry.registerExtensionPoint({
    extensionPoint: 'semanticTokenTypes',
    jsonSchema: {
        description: ( localize(3127, 'Contributes semantic token types.')),
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: ( localize(3128, 'The identifier of the semantic token type')),
                    pattern: typeAndModifierIdPattern,
                    patternErrorMessage: ( localize(3129, 'Identifiers should be in the form letterOrDigit[_-letterOrDigit]*')),
                },
                superType: {
                    type: 'string',
                    description: ( localize(3130, 'The super type of the semantic token type')),
                    pattern: typeAndModifierIdPattern,
                    patternErrorMessage: ( localize(3131, 'Super types should be in the form letterOrDigit[_-letterOrDigit]*')),
                },
                description: {
                    type: 'string',
                    description: ( localize(3132, 'The description of the semantic token type')),
                }
            }
        }
    }
});
const tokenModifierExtPoint = ExtensionsRegistry.registerExtensionPoint({
    extensionPoint: 'semanticTokenModifiers',
    jsonSchema: {
        description: ( localize(3133, 'Contributes semantic token modifiers.')),
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: ( localize(3134, 'The identifier of the semantic token modifier')),
                    pattern: typeAndModifierIdPattern,
                    patternErrorMessage: ( localize(3135, 'Identifiers should be in the form letterOrDigit[_-letterOrDigit]*'))
                },
                description: {
                    type: 'string',
                    description: ( localize(3136, 'The description of the semantic token modifier'))
                }
            }
        }
    }
});
const tokenStyleDefaultsExtPoint = ExtensionsRegistry.registerExtensionPoint({
    extensionPoint: 'semanticTokenScopes',
    jsonSchema: {
        description: ( localize(3137, 'Contributes semantic token scope maps.')),
        type: 'array',
        items: {
            type: 'object',
            properties: {
                language: {
                    description: ( localize(3138, 'Lists the languge for which the defaults are.')),
                    type: 'string'
                },
                scopes: {
                    description: ( localize(
                        3139,
                        'Maps a semantic token (described by semantic token selector) to one or more textMate scopes used to represent that token.'
                    )),
                    type: 'object',
                    additionalProperties: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    }
});
class TokenClassificationExtensionPoints {
    constructor() {
        function validateTypeOrModifier(contribution, extensionPoint, collector) {
            if (typeof contribution.id !== 'string' || contribution.id.length === 0) {
                collector.error(( localize(
                    3140,
                    "'configuration.{0}.id' must be defined and can not be empty",
                    extensionPoint
                )));
                return false;
            }
            if (!contribution.id.match(typeAndModifierIdPattern)) {
                collector.error(( localize(
                    3141,
                    "'configuration.{0}.id' must follow the pattern letterOrDigit[-_letterOrDigit]*",
                    extensionPoint
                )));
                return false;
            }
            const superType = contribution.superType;
            if (superType && !superType.match(typeAndModifierIdPattern)) {
                collector.error(( localize(
                    3142,
                    "'configuration.{0}.superType' must follow the pattern letterOrDigit[-_letterOrDigit]*",
                    extensionPoint
                )));
                return false;
            }
            if (typeof contribution.description !== 'string' || contribution.id.length === 0) {
                collector.error(( localize(
                    3143,
                    "'configuration.{0}.description' must be defined and can not be empty",
                    extensionPoint
                )));
                return false;
            }
            return true;
        }
        tokenTypeExtPoint.setHandler((extensions, delta) => {
            for (const extension of delta.added) {
                const extensionValue = extension.value;
                const collector = extension.collector;
                if (!extensionValue || !Array.isArray(extensionValue)) {
                    collector.error(( localize(3144, "'configuration.semanticTokenType' must be an array")));
                    return;
                }
                for (const contribution of extensionValue) {
                    if (validateTypeOrModifier(contribution, 'semanticTokenType', collector)) {
                        tokenClassificationRegistry.registerTokenType(contribution.id, contribution.description, contribution.superType);
                    }
                }
            }
            for (const extension of delta.removed) {
                const extensionValue = extension.value;
                for (const contribution of extensionValue) {
                    tokenClassificationRegistry.deregisterTokenType(contribution.id);
                }
            }
        });
        tokenModifierExtPoint.setHandler((extensions, delta) => {
            for (const extension of delta.added) {
                const extensionValue = extension.value;
                const collector = extension.collector;
                if (!extensionValue || !Array.isArray(extensionValue)) {
                    collector.error(( localize(3145, "'configuration.semanticTokenModifier' must be an array")));
                    return;
                }
                for (const contribution of extensionValue) {
                    if (validateTypeOrModifier(contribution, 'semanticTokenModifier', collector)) {
                        tokenClassificationRegistry.registerTokenModifier(contribution.id, contribution.description);
                    }
                }
            }
            for (const extension of delta.removed) {
                const extensionValue = extension.value;
                for (const contribution of extensionValue) {
                    tokenClassificationRegistry.deregisterTokenModifier(contribution.id);
                }
            }
        });
        tokenStyleDefaultsExtPoint.setHandler((extensions, delta) => {
            for (const extension of delta.added) {
                const extensionValue = extension.value;
                const collector = extension.collector;
                if (!extensionValue || !Array.isArray(extensionValue)) {
                    collector.error(( localize(3146, "'configuration.semanticTokenScopes' must be an array")));
                    return;
                }
                for (const contribution of extensionValue) {
                    if (contribution.language && typeof contribution.language !== 'string') {
                        collector.error(( localize(3147, "'configuration.semanticTokenScopes.language' must be a string")));
                        continue;
                    }
                    if (!contribution.scopes || typeof contribution.scopes !== 'object') {
                        collector.error(( localize(
                            3148,
                            "'configuration.semanticTokenScopes.scopes' must be defined as an object"
                        )));
                        continue;
                    }
                    for (const selectorString in contribution.scopes) {
                        const tmScopes = contribution.scopes[selectorString];
                        if (!Array.isArray(tmScopes) || ( (tmScopes.some(l => typeof l !== 'string')))) {
                            collector.error(( localize(
                                3149,
                                "'configuration.semanticTokenScopes.scopes' values must be an array of strings"
                            )));
                            continue;
                        }
                        try {
                            const selector = tokenClassificationRegistry.parseTokenSelector(selectorString, contribution.language);
                            tokenClassificationRegistry.registerTokenStyleDefault(selector, { scopesToProbe: ( (tmScopes.map(s => s.split(' ')))) });
                        }
                        catch (e) {
                            collector.error(( localize(
                                3150,
                                "configuration.semanticTokenScopes.scopes': Problems parsing selector {0}.",
                                selectorString
                            )));
                        }
                    }
                }
            }
            for (const extension of delta.removed) {
                const extensionValue = extension.value;
                for (const contribution of extensionValue) {
                    for (const selectorString in contribution.scopes) {
                        const tmScopes = contribution.scopes[selectorString];
                        try {
                            const selector = tokenClassificationRegistry.parseTokenSelector(selectorString, contribution.language);
                            tokenClassificationRegistry.registerTokenStyleDefault(selector, { scopesToProbe: ( (tmScopes.map(s => s.split(' ')))) });
                        }
                        catch (e) {
                        }
                    }
                }
            }
        });
    }
}
let TokenClassificationExtensionPointWorkbenchContribution = class TokenClassificationExtensionPointWorkbenchContribution {
    static { this.ID = 'workbench.contrib.tokenClassificationExtensionPoint'; }
    constructor(instantiationService) {
        this.instantiationService = instantiationService;
        this.instantiationService.createInstance(TokenClassificationExtensionPoints);
    }
};
TokenClassificationExtensionPointWorkbenchContribution = ( (__decorate([
    ( (__param(0, IInstantiationService)))
], TokenClassificationExtensionPointWorkbenchContribution)));
registerWorkbenchContribution2(TokenClassificationExtensionPointWorkbenchContribution.ID, TokenClassificationExtensionPointWorkbenchContribution, 1 );

export { TokenClassificationExtensionPoints };
