# SyncRun Location-Based Services Terms

| Item | Detail |
| --- | --- |
| Document version | v1.5 |
| Effective date | 24 October 2026 |
| Last amended | 18 September 2026 |

> **This English text is a translation provided for your convenience. The Korean version is the authoritative original.** If the two differ, the Korean version governs. Article numbers match the Korean original so that references line up across both versions.

These Terms set out the rights, obligations and responsibilities between SyncRun Labs (the "Company") and you as a subject of personal location information, with respect to the location-based services the Company provides, in accordance with the Act on the Protection and Use of Location Information (the "Location Information Act") of the Republic of Korea.

---

## Article 1 (Purpose)

These Terms set out the rights, obligations and responsibilities between the Company and the subject of personal location information, and other necessary matters, in connection with the location-based services of the iOS and Android running application SyncRun (the "Service").

---

## Article 2 (Rules Outside These Terms)

Matters not specified in these Terms are governed by the Location Information Act, the Personal Information Protection Act, the Telecommunications Business Act and other relevant laws, together with the Company's Terms of Service and Privacy Policy.

---

## Article 3 (Service Content and Fees)

1. The Company collects location information directly, or receives it from a location information provider, and offers the following location-based services.

| Service | Content | Fee |
| --- | --- | --- |
| Running distance and route measurement | Measures your location during a run and records distance, pace, elevation gain, 1 km splits and the route travelled. | Free |
| Finding a bump partner | While the group formation screen is open, uses your location so that you can be matched with users waiting nearby to bump. Coordinates and distances are not provided to other users. | Free |
| Live location sharing in a group run | Relays your live location, distance and pace during a run to the participants of a session formed by tapping phones together, so that you can see one another on a map. | Free |
| Run place label | Reverse-geocodes the run location and labels the run record and run title with a neighbourhood (dong) level place name. | Free |
| Run card route display | Visualises the route of a saved run record as a run card image. | Free |

2. The Service is free of charge. Mobile data charges required to use the Service may be billed separately under the policy of your mobile carrier.

3. The Company uses personal location information to provide each of the services above. If you do not grant location access, location-based services cannot be provided.

---

## Article 4 (How Personal Location Information Is Collected and Used)

1. The Company collects personal location information through the GPS and related sensors built into your device.

2. The Company collects and uses personal location information only in the following two cases. In any other state, the Service does not collect your location.

   1. Location collected during a run is used on the device to calculate distance and route, and, in a group run, is relayed in real time only to participants within the session that has been formed.
   2. Location collected while waiting to bump (while the group formation screen is open) is used only to find users waiting nearby to bump, and is collected only while that screen is open. This location is not provided to other users as coordinates or as a distance (Article 6).

3. Server storage of personal location information is as follows.

   - Live latitude and longitude during a run (for relaying between session participants) and while waiting to bump (for identifying nearby waiting users) exist only in server memory and are not stored in a database. The Company does not record these coordinates in logs either.
   - Live latitude and longitude during a run are erased when the session ends.
   - Latitude and longitude while waiting to bump are erased immediately when you leave the group formation screen or a run begins, and are erased automatically within 45 seconds if updates stop. They are also erased if you close the app or the connection drops.
   - The route retained in a record after a run is a low-resolution path normalised to values between 0 and 1; it is not actual latitude and longitude.
   - Place names are stored only at the neighbourhood (dong) level.

4. The normalised route and neighbourhood-level place name retained in a run record are defaults that cannot be lowered in settings.

---

## Article 5 (Basis and Retention Period for Records Confirming Use and Provision of Personal Location Information)

1. Article 16(2) of the Location Information Act requires a location-based service provider to record and preserve, automatically within its location information system, records confirming the collection, use and provision of location information, and to retain them for six months.

2. Those records include the following. Coordinates are not included.

   - Identifier of the subject of personal location information
   - Date and time of collection, use or provision of location information
   - Purpose of the use or provision of location information
   - Recipient of the location information
   - Method of collection, use or provision of location information

3. The Company is building the capability to record and preserve the records described in paragraph 2 automatically in its location information system and to provide a means of access to them; when it takes effect, the Company will give notice of that fact and the effective date and update this Article. As at the effective date of these Terms, such records are not being kept.

4. These records are used only to respond to a request for access or notification by the subject of personal location information (Article 8) and to prevent misuse of location information.

---

## Article 6 (Provision to Third Parties and Notification)

1. The Company does not provide personal location information to third parties without the consent of the subject of personal location information.

2. The Company provides personal location information to third parties designated by the subject of personal location information as follows.

| Recipient | Purpose | Items provided | When | End of provision |
| --- | --- | --- | --- | --- |
| Participants of the same running session | To see one another's location and progress during a group run | Live location (latitude and longitude), distance and pace during the run | In real time while the group run session is in progress | Stops immediately when the session ends |
| Users waiting nearby to bump | To identify each other as bump partners and, where automatic formation does not occur, to request and accept joining | Display name and profile photo (coordinates and distance, which are personal location information, are not provided) | While both users have the group formation screen open | Stops immediately on leaving the screen |

3. Provision to third parties occurs only to participants of a session you formed by tapping phones together. The act of tapping phones together to form a group is itself the act of designating the third-party recipients.
   While waiting to bump, the act of opening the group formation screen is itself the act of designating nearby users who have the same screen open as recipients, and the only items provided at that stage are display name and profile photo. Personal location information (coordinates and distance) is not provided to any user at this stage. Nothing is provided if only one side has the screen open.

4. Notification of provision (Article 19(3) of the Location Information Act)

   Where the Company provides personal location information to a third party designated by the subject, the Company immediately notifies the subject, on each occasion and through the communications terminal from which the location information was collected (your device), of the recipient, the date and time, and the purpose of provision.

   - When a group run session is formed, the app screen shows the list of participants running with you (the recipients) and the time at which and purpose for which location sharing began.
   - The map screen during a run shows that your live location is being shared and with whom.
   - While waiting to bump, personal location information is not provided to third parties (Article 6(2) and (3)), so no notification arises at that stage. The app does, however, indicate on the group formation screen that your location is being used to find a partner while that screen is open.
   - Under Article 19(4) of the Location Information Act, you may request in advance to receive the above notifications together on a collected basis, or by a method you specify.

5. You may stop live location sharing at any time from the app settings or from the map screen during a run. Turning sharing off does not affect the measurement of your own running distance and route or the saving of your records.

---

## Article 7 (Purpose and Period of Retention of Personal Location Information)

1. The Company retains personal location information only for the minimum period necessary to provide location-based services.

2. Retention periods are as follows.

| Category | Retention period |
| --- | --- |
| Live latitude and longitude during a run | Erased immediately when the session ends (held only in server memory, not stored in a database) |
| Latitude and longitude while waiting to bump | Erased immediately on leaving the group formation screen or starting a run; erased automatically within 45 seconds if updates stop (held only in server memory, not stored in a database) |
| Normalised route in a run record (0–1 coordinates) | Until you withdraw your membership or delete that record |
| Place name (neighbourhood level) | Until you withdraw your membership or delete that record |
| Records confirming use and provision of location information | Six months (Article 16(2) of the Location Information Act) |

3. Where the purpose of using personal location information has been achieved, the Company destroys that information without delay.

---

## Article 8 (Rights of the Subject of Personal Location Information)

Under Article 24 of the Location Information Act, you have the following rights.

1. Withdrawal of consent (Article 24(1))

   - You may withdraw all or part of your consent to the collection, use and provision of personal location information at any time.
   - You may withdraw by turning off location access for SyncRun in your device settings (iOS: Settings > SyncRun > Location; Android: Settings > Apps > SyncRun > Permissions > Location), or by withdrawing your membership from the Me tab in the app.
   - To withdraw consent to third-party provision only, turn off live location sharing in the app settings or on the map screen during a run.
   - Where consent is withdrawn, the Company destroys the collected personal location information and the records confirming use and provision without delay. This does not apply to records already recorded and preserved under Article 16(2) of the Location Information Act before the withdrawal.

2. Request for temporary suspension (Article 24(2))

   - You may at any time request temporary suspension of the collection, use and provision of personal location information. The Company does not refuse such a request and maintains the technical means to give effect to it.
   - You make the request by turning on the pause of location collection in the settings on the Me tab of the app; in that case, location collection is suspended both during a run and while waiting to bump. Staying off the group formation screen without starting a run, and turning off location access in your device settings, have the same effect.
   - While location collection is suspended, bump partners cannot be found and group formation does not occur. Solo running continues to be measured on a step basis and records are still saved.

3. Request for access or notification (Article 24(3))

   - You may request access to, or notification of, the records confirming collection, use and provision of location information relating to you, and the reasons for and content of any provision of your personal location information to third parties under the Location Information Act or another statute. Where such records contain errors, you may request that they be corrected.
   - The Company does not refuse such a request without justifiable grounds, and on receiving one takes the necessary measures without delay after verifying your identity.
   - Requests are made in writing or by email to the location information manager named in Article 11.

4. The Company does not refuse to provide the Service, or otherwise disadvantage you, on the ground that you exercise the rights in paragraphs 1 to 3. However, if you withdraw consent to the collection of location information or suspend collection, running distance and route measurement and group run location sharing cannot, by their nature, be used.

---

## Article 9 (Rights of Legal Representatives)

1. The Company does not permit children under the age of 14 to sign up for the Service, and therefore does not collect, use or provide the personal location information of children under 14.

2. If the Company becomes aware that the personal location information of a child under 14 has been collected, it destroys that information and the related records confirming use and provision without delay, and deletes the related account.

---

## Article 10 (Rights of Guardians of Children Aged 8 or Under and Others)

1. Under Article 26 of the Location Information Act, where the guardian of a person falling under any of the following (a "child aged 8 or under and others") consents to the collection, use or provision of personal location information for the protection of that person's life or body, such consent is deemed to be the consent of the person themselves.

   1. A child aged 8 or under
   2. A person under adult guardianship
   3. A person with a mental disability under Article 2(2)2 of the Act on Welfare of Persons with Disabilities who is a person with a severe disability under Article 2(2) of the Act on the Employment Promotion and Vocational Rehabilitation of Persons with Disabilities (limited to persons registered as disabled under Article 32 of the Act on Welfare of Persons with Disabilities)

2. A guardian of a child aged 8 or under and others means a person who actually protects that person and falls under any of the following.

   1. The legal representative of a child aged 8 or under, or a guardian under Article 3 of the Act on the Guardianship of Minors in Protective Facilities
   2. The legal representative of a person under adult guardianship
   3. The legal representative of a person with a severe disability under paragraph 1(3), or the head of a residential facility for persons with disabilities under Article 58(1)1 of the Act on Welfare of Persons with Disabilities (limited to facilities established and operated by the State or a local government), the head of a mental care facility under Article 22 of the Act on the Improvement of Mental Health and the Support for Welfare Services for Mental Patients, or the head of a mental rehabilitation facility under Article 26 of the same Act (limited to facilities established and operated by the State or a local government)

3. A guardian who wishes to consent to the collection, use or provision of the personal location information of a child aged 8 or under and others must submit to the Company a written consent form together with a document proving their status as guardian.

4. A guardian may exercise, on behalf of a child aged 8 or under and others, all of the rights of the subject of personal location information under Article 8 (withdrawal of consent, request for temporary suspension, request for access or notification).

5. However, because the Company does not currently permit sign-up by persons under the age of 14, no collection, use or provision of personal location information under this Article takes place in respect of children aged 8 or under. This Article applies to persons under adult guardianship and to persons with a severe disability under paragraph 1(3).

---

## Article 11 (Designation of the Location Information Manager)

1. The Company designates and operates a location information manager as follows, so that personal location information is managed safely and complaints from subjects of personal location information are handled smoothly.

| Item | Detail |
| --- | --- |
| Name | Changmok Lee |
| Position | Representative |
| Email | contact@syncrunlabs.com |

2. The location information manager has overall responsibility for the protection and management of personal location information and also serves as the personal information protection officer under Article 11 of the Privacy Policy.

3. If the location information manager changes, the Company files a change report with the Korea Communications Commission and updates this Article.

---

## Article 12 (Compensation for Damage)

1. Where you suffer damage as a result of the Company's violation of Articles 15 through 26 of the Location Information Act, you may claim compensation from the Company under Article 27 of that Act.

2. In such a case, the Company cannot be relieved of liability unless it proves the absence of intent or negligence.

---

## Article 13 (Exemptions)

1. The Company is not liable for damage arising to a subject of personal location information where location-based services cannot be provided for any of the following reasons.

   1. A natural disaster or an equivalent event of force majeure
   2. Suspension of the Service, announced in advance, for system inspection, maintenance or replacement in order to provide location-based services efficiently
   3. An impediment to use of the Service attributable to the user
   4. A service failure of a mobile carrier or common telecommunications provider
   5. Other causes not attributable to the Company's intent or negligence

2. With respect to the quality of location-based services, the Company is not liable for measurement error inherent in the nature of GPS signals. Location accuracy may be lower indoors, underground, in areas dense with tall buildings, and in tunnels, and this may cause error in distance and pace records.

3. The Company does not warrant the accuracy or completeness of information provided through location-based services, and is not liable for the consequences of actions you take in reliance on that information.

---

## Article 14 (Dispute Mediation and Other Matters)

1. Where agreement cannot be reached, or cannot be sought, with a subject of personal location information in relation to a location information dispute, the Company may apply to the Korea Communications Commission for adjudication under Article 28 of the Location Information Act.

2. Where agreement cannot be reached, or cannot be sought, between the parties in relation to a location information dispute, the Company or the subject of personal location information may apply for mediation to the Personal Information Dispute Mediation Committee under Article 40 of the Personal Information Protection Act.

3. Contact details of the relevant bodies are as follows.

| Body | Role | Telephone | Website |
| --- | --- | --- | --- |
| Korea Communications Commission | Adjudication of location information disputes; complaints on location information businesses | 1335 (no area code) | www.kcc.go.kr |
| Personal Information Dispute Mediation Committee | Applications for mediation of personal information and location information disputes | 1833-6972 (no area code) | www.kopico.go.kr |
| Privacy Infringement Report Centre (KISA) | Reports of and consultation on privacy infringement | 118 (no area code) | privacy.kisa.or.kr |

---

## Article 15 (Amendment of These Terms)

1. The Company may amend these Terms to the extent that doing so does not violate the Location Information Act or other relevant laws.

2. Where the Company amends these Terms, it announces the amendment together with the current Terms, stating the effective date and the reasons, through the in-app notices and other means, from seven days before the effective date (30 days before, where the change is unfavourable to users).

3. Where the Company, in announcing amended Terms under paragraph 2, has clearly stated that failure to express refusal by the effective date will be treated as consent, and you do not expressly refuse, you are deemed to have consented to the amended Terms.

4. Where you do not consent to the amended Terms, the Company cannot apply the amended Terms to you, and you may terminate the service agreement.

---

## Article 16 (Company Information and Location-Based Service Business Filing)

| Item | Detail |
| --- | --- |
| Business name | SyncRun Labs |
| Representative | Changmok Lee |
| Business registration number | 656-09-03142 |
| Business address | 32 Daehak-ro 8-gil, Gyeongsan-si, Gyeongsangbuk-do, Republic of Korea |
| Service name | SyncRun |
| Form of operation | Sole proprietorship |
| Service launch date | 9 September 2026 (App Store release) |
| Contact · location information manager | contact@syncrunlabs.com |
| Location-based service business filing number | No. 1589 (accepted 18 September 2026) |

1. Because the Service collects personal location information and provides it to other participants of the same running session, it is subject to the location-based service business filing requirement under Article 9 of the Location Information Act.

2. The Company filed its small-business location-based service business notification with the Korea Media and Communications Commission under Article 9(1) and Article 9-2 of the Location Information Act, and the filing was accepted on 18 September 2026 as filing No. 1589. The type of business filed is "location-based services provided through a mobile application".

3. If any filed particular changes — such as the business name, address, representative or location information manager — the Company will file an amendment and update this Article.

---

## Addendum

These Terms take effect on 24 October 2026 and replace the previous Terms (effective 25 September 2026).
