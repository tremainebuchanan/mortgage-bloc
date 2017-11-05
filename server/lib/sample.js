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

/**
 * Track the status of a sales agreement
 * @param {org.acme.mortgagebloc.SalesAgreementTansaction} salesAgreementTansaction
 * @transaction
 */
function changeSalesAgreementStatus(salesAgreementTansaction) {
    salesAgreementTansaction.salesAgreement.status = salesAgreementTansaction.status;
    return getAssetRegistry('org.acme.mortgagebloc.SalesAgreement')
        .then(function (assetRegistry) {
            return assetRegistry.update(salesAgreementTansaction.salesAgreement);
        });
}

/**
 * Track the transfer of a title from seller to buyer
 * @param {org.acme.mortgagebloc.ChangeOfOwnership} changeOfOwnership
 * @transaction
 */
function changeTitleOwnership(changeOfOwnership) {
    changeOfOwnership.certificateOfTitle.owner = changeOfOwnership.buyer;
    return getAssetRegistry('org.acme.mortgagebloc.CertificateOfTitle')
        .then(function (assetRegistry) {
            return assetRegistry.update(changeOfOwnership.certificateOfTitle);
        });
}
