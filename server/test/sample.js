/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const AdminConnection = require('composer-admin').AdminConnection;
const BrowserFS = require('browserfs/dist/node/index');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const path = require('path');

require('chai').should();

const bfs_fs = BrowserFS.BFSRequire('fs');
const NS = 'org.acme.mortgagebloc';

describe('Commodity Trading', () => {

    // let adminConnection;
    let businessNetworkConnection;

    before(() => {
        BrowserFS.initialize(new BrowserFS.FileSystem.InMemory());
        const adminConnection = new AdminConnection({ fs: bfs_fs });
        return adminConnection.createProfile('defaultProfile', {
            type: 'embedded'
        })
            .then(() => {
                return adminConnection.connect('defaultProfile', 'admin', 'adminpw');
            })
            .then(() => {
                return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
            })
            .then((businessNetworkDefinition) => {
                return adminConnection.deploy(businessNetworkDefinition);
            })
            .then(() => {
                businessNetworkConnection = new BusinessNetworkConnection({ fs: bfs_fs });
                return businessNetworkConnection.connect('defaultProfile', 'mortgagebloc', 'admin', 'adminpw');
            });
    });

    describe('#SalesAgreementTansaction', () => {

        it('should be able to change status to STAMPED', () => {
            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            const buyer = factory.newResource(NS, 'Person', '7343');
            buyer.firstName = 'Mary';
            buyer.lastName = 'Jane';
            buyer.type = 'BUYER';

            const seller = factory.newResource(NS, 'Person', '2314');
            seller.firstName = 'Jim';
            seller.lastName = 'Brown';
            seller.type = 'SELLER';


            const salesAgreement = factory.newResource(NS, 'SalesAgreement', '8678');
            salesAgreement.conditions = 'Good';
            salesAgreement.cost = 5000000.0;
            salesAgreement.status = 'SIGNED';
            salesAgreement.buyer = factory.newRelationship(NS, 'Person', buyer.$identifier);
            salesAgreement.seller = factory.newRelationship(NS, 'Person', seller.$identifier);

            // create the trade transaction
            const salesAgreementTansaction = factory.newTransaction(NS, 'SalesAgreementTansaction');
            salesAgreementTansaction.salesAgreement = factory.newRelationship(NS, 'SalesAgreement', salesAgreement.$identifier);
            salesAgreementTansaction.status = 'STAMPED';

            // Get the asset registry.
            let salesAgreementRegistry;
            return businessNetworkConnection.getAssetRegistry(NS + '.SalesAgreement')
                .then((assetRegistry) => {
                    salesAgreementRegistry = assetRegistry;
                    // add the commodity to the asset registry.
                    return salesAgreementRegistry.add(salesAgreement);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(NS + '.Person');
                })
                .then((participantRegistry) => {
                    // add the traders
                    return participantRegistry.addAll([buyer, seller]);
                })
                .then(() => {
                    // submit the transaction
                    return businessNetworkConnection.submitTransaction(salesAgreementTansaction);
                })
                .then(() => {
                    // re-get the commodity
                    return salesAgreementRegistry.get(salesAgreement.$identifier);
                })
                .then((newSalesAgreement) => {
                    // the owner of the commodity should now be simon
                    newSalesAgreement.status.should.equal('STAMPED');
                });
        });
    });

    describe('#ChangeOfOwnership', () => {
        it('should be able to change ownership', () => {
            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            const buyer = factory.newResource(NS, 'Person', '6757');
            buyer.firstName = 'Mary';
            buyer.lastName = 'Jane';
            buyer.type = 'BUYER';

            const owner = factory.newResource(NS, 'Person', '6467');
            owner.firstName = 'Jim';
            owner.lastName = 'Brown';
            owner.type = 'SELLER';

            const surveyor = factory.newResource(NS, 'Entity', '7687');
            surveyor.name = 'Tom\'s Surveyors' ;
            surveyor.type = 'SURVEYOR';

            const valuator = factory.newResource(NS, 'Entity', '5747');
            valuator.name = 'Stamford & Sons';
            valuator.type = 'VALUATOR';

            const valuationReport = factory.newResource(NS, 'ValuationReport', '8580');
            valuationReport.value = 5000000;
            valuationReport.condition = 'Good';
            valuationReport.valuator = factory.newRelationship(NS, 'Entity', valuator.$identifier);

            const surveyorReport = factory.newResource(NS, 'SurveyorReport', '8476');
            surveyorReport.size = 1500;
            surveyorReport.location = 'Kingston';
            surveyorReport.surveyor = factory.newRelationship(NS, 'Entity', surveyor.$identifier);

            const certificateOfTitle = factory.newResource(NS, 'CertificateOfTitle', '3133');
            certificateOfTitle.volumne = '1290';
            certificateOfTitle.folio = '12';
            certificateOfTitle.leinAmount = 0;
            certificateOfTitle.mortgageProvider = '';
            certificateOfTitle.owner = factory.newRelationship(NS, 'Person', owner.$identifier);
            certificateOfTitle.valuationReport = factory.newRelationship(NS, 'ValuationReport', valuationReport.$identifier);
            certificateOfTitle.surveyorReport = factory.newRelationship(NS, 'SurveyorReport', surveyorReport.$identifier);

            // create the trade transaction
            const changeOfOwnership = factory.newTransaction(NS, 'ChangeOfOwnership');
            changeOfOwnership.certificateOfTitle = factory.newRelationship(NS, 'CertificateOfTitle', certificateOfTitle.$identifier);
            changeOfOwnership.buyer = factory.newRelationship(NS, 'Person', buyer.$identifier);

            // Get the asset registry.
            let certificateOfTitleRegistry;
            return businessNetworkConnection.getAssetRegistry(NS + '.CertificateOfTitle')
                .then((assetRegistry) => {
                    certificateOfTitleRegistry = assetRegistry;
                    // add the commodity to the asset registry.
                    return certificateOfTitleRegistry.add(certificateOfTitle);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(NS + '.Person');
                })
                .then((participantRegistry) => {
                    // add the traders
                    return participantRegistry.addAll([buyer, owner]);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(NS + '.Entity');
                })
                .then((entityRegistry) => {
                    // add the traders
                    return entityRegistry.addAll([surveyor, valuator]);
                })
                .then(() => {
                    return businessNetworkConnection.getAssetRegistry(NS + '.ValuationReport');
                })
                .then((valuationReportRegistry) => {
                    // add the traders
                    return valuationReportRegistry.add(valuationReport);
                })
                .then(() => {
                    return businessNetworkConnection.getAssetRegistry(NS + '.SurveyorReport');
                })
                .then((surveyorReportRegistry) => {
                    // add the traders
                    return surveyorReportRegistry.add(surveyorReport);
                })
                .then(() => {
                    // submit the transaction
                    return businessNetworkConnection.submitTransaction(changeOfOwnership);
                })
                .then(() => {
                    // re-get the commodity
                    return certificateOfTitleRegistry.get(certificateOfTitle.$identifier);
                })
                .then((newCertificateOfTitle) => {
                    // the owner of the commodity should now be simon
                    newCertificateOfTitle.owner.$identifier.should.equal(buyer.$identifier);
                });
        });
    });
});