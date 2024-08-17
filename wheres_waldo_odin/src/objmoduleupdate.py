from CPQ_SF_IntegrationModules import CL_SalesforceIntegrationModules
from CPQ_SF_IntegrationReferences import CL_SalesforceApis as API, CL_IntegrationReferences as INT_REF, CL_SalesforceApiLimits as API_LIMIT
from CPQ_SF_CpqHelper import EVENT_CREATE, EVENT_UPDATE
from CPQ_SF_CustomObjectMapping import CL_CustomObjectMapping


###############################################################################################
# Class CL_CustomObjectModules:
#       Class to store integration functions related to custom objects
###############################################################################################
class CL_CustomObjectModules(CL_SalesforceIntegrationModules):

    ###############################################################################################
    # Function process inbound custom object mappings (Salesforce -> CPQ)
    ###############################################################################################
    def process_inbound_custom_object_mappings(self, bearerToken, event):
        class_custom_object_mapping = CL_CustomObjectMapping(self.Quote, None)
        #Log.Write("custom Object---->")
        mappings = filter(lambda x: x["Inbound"], class_custom_object_mapping.custom_object_mappings())
        if mappings:
            queryObjResponse, linkedToQuoteResponse = self.get_custom_objects(bearerToken, mappings)
            if queryObjResponse or linkedToQuoteResponse:
                for mapping in mappings:
                    # Get custom Object details
                    customObject = None
                    if queryObjResponse:
                        #Log.Write("mapping QOR--->"+str(mapping))
                        customObject = next((resp["body"] for resp in queryObjResponse["compositeResponse"] if resp["referenceId"] == mapping["Name"]), None)
                    if customObject is None and linkedToQuoteResponse:
                        #Log.Write("mapping COO--->"+str(mapping))
                        customObject = next((resp["body"] for resp in linkedToQuoteResponse["compositeResponse"] if resp["referenceId"] == mapping["Name"]), None)

                    if customObject:
                        #Log.Write("event--->"+str(event))
                        Log.Write("customObject--->"+str(customObject))
                        try:
                            name = self.Quote.GetCustomField('CF_Sales_Person')
                            qry = "SELECT Business_Area FROM Business_Area_List WHERE Salesperson_Name = '{}'".format(name)
                            data = SqlHelper.GetFirst(qry)
                            if data is not None and data != '':
                                self.Quote['CF_Business Area_NAM'] = data.Business_Area
                            Log.Info('self.Quote[CF_Business Area_NAM ' + str(self.Quote['CF_Business Area_NAM']))
                        except:
                            Log.Info('error set custom fields')

                        if event == EVENT_CREATE:
                            class_custom_object_mapping.on_quote_create_custom_object_mapping(self.Quote, customObject, mapping["Name"])
                            #Log.Write("mapping-call 11-->"+str(mapping))
                            class_custom_object_mapping.on_quote_createupdate_custom_object_mapping(self.Quote, customObject, mapping["Name"])
                        elif event == EVENT_UPDATE:
                            class_custom_object_mapping.on_quote_update_custom_object_mapping(self.Quote, customObject, mapping["Name"])
                            #Log.Write("mapping-call 122-->"+str(mapping))
                            class_custom_object_mapping.on_quote_createupdate_custom_object_mapping(self.Quote, customObject, mapping["Name"])

    ###############################################################################################
    # Function to get custom obect ids for Query types
    ###############################################################################################
    def get_query_custom_object_ids(self, bearerToken, mappings):
        response = None
        compositePayload = list()
        # For Custom Object Queries
        for mapping in filter(lambda x: x["Linked_To_Quote"] is False, mappings):
            compositeRequest = self.build_soql_query_composite_payload(mapping["Query"], mapping["Name"])
            compositePayload.append(compositeRequest)
        if compositePayload:
            # Call REST API
            #Log.Write("compositePayload---->"+str(compositePayload))
            response = self.post_composite_request(bearerToken, compositePayload, INT_REF.REF_GET_CUSTOM_OBJECTS)
        return response

    ###############################################################################################
    # Function to get custom obect information
    ###############################################################################################
    def get_custom_objects(self, bearerToken, mappings):
        queryObjResponse = None
        linkedToQuoteResponse = None
        # For Custom Object Queries
        custObjQueryMappings = filter(lambda x: x["Linked_To_Quote"] is False, mappings)
        Log.Write("custObjQueryMappings---->"+str(custObjQueryMappings))
        responses = list()
        # Execute queries in batches of 5 as per Composite Request limitation in API_LIMIT.CR_SOQL_LIMIT
        for batch in range(0, len(custObjQueryMappings), API_LIMIT.CR_SOQL_LIMIT):
            response = self.get_query_custom_object_ids(bearerToken, custObjQueryMappings[batch:batch+API_LIMIT.CR_SOQL_LIMIT])
            if response:
                Log.Write("response---->"+str(response))
                responses.append(response)
        Log.Write("responses---->"+str(responses))
        if responses:
            compositePayload_ext = list()
            for response in responses:
                if response["compositeResponse"]:
                    compositePayload = list()
                    #compositePayload_ext = list()
                    compositeRequest = dict()
                    for mapping in mappings:
                        # Get Custom Object response
                        Log.Info("mapping---->"+str(mapping))
                        customObjectResponse = next((resp for resp in response["compositeResponse"] if resp["referenceId"] == mapping["Name"] and resp["body"]["totalSize"] > 0), None)
                        if customObjectResponse:
                            # Get Custom Object Id
                            Log.Write("customObjectResponse----->"+str(customObjectResponse))
                            customObjectRecord = next((rec for rec in customObjectResponse["body"]["records"]), None)
                            #Log.Write("customObjectRecord----->"+str(customObjectRecord))
                            if customObjectRecord:
                                customObjectId = str()
                                for attr in customObjectRecord:
                                    if attr.Name != "attributes":
                                        customObjectId = str(getattr(customObjectRecord, attr.Name))
                                        break
                                # Get Custom Object details
                                if customObjectId != "":
                                    url = API.GET_SOBJECT_API.format(sObject=str(mapping["Type"]), sObjectId=str(customObjectId))
                                    method = API.GET
                                    compositeRequest = self.build_cr_sobject_request(url, method, None, mapping["Name"])
                                    compositePayload.append(compositeRequest)
                                    compositePayload_ext.append(compositeRequest)

                    if compositePayload:
                        # Call REST API
                        #Log.Write("compositePayload--ULLlll-->"+str(compositePayload))
                        #Log.Write("compositePayload--ULL222-->"+str(compositePayload_ext))
                        #queryObjResponse = self.post_composite_request(bearerToken, compositePayload, INT_REF.REF_GET_CUSTOM_OBJECTS)
                        queryObjResponse = self.post_composite_request(bearerToken, compositePayload_ext, INT_REF.REF_GET_CUSTOM_OBJECTS)
        # For Custom Object Linked to Quote
        compositePayload = list()
        try:
            customObjectQuoteTable = self.Quote.QuoteTables["CPQ_SF_QUOTE_CUSTOM_OBJECTS"]
        except SystemError as e:
            Log.Error("CPQ-SFDC: Custom Object table not found", str(e))
            customObjectQuoteTable = None
        if customObjectQuoteTable:
            for mapping in filter(lambda x: x["Linked_To_Quote"], mappings):
                customObject = next((row for row in customObjectQuoteTable.Rows if row.GetColumnValue("CUSTOM_OBJECT_NAME") == mapping["Name"]), None)
                if customObject:
                    customObjectId = customObject.GetColumnValue("CUSTOM_OBJECT_ID")
                    # Get Custom Object details
                    if customObjectId != "":
                        url = API.GET_SOBJECT_API.format(sObject=str(mapping["Type"]), sObjectId=str(customObjectId))
                        method = API.GET
                        compositeRequest = self.build_cr_sobject_request(url, method, None, mapping["Name"])
                        compositePayload.append(compositeRequest)
        if compositePayload:
            # Call REST API
            #Log.Write("compositePayload--quotelinked-->"+str(compositePayload))
            linkedToQuoteResponse = self.post_composite_request(bearerToken, compositePayload, INT_REF.REF_GET_CUSTOM_OBJECTS)
        return queryObjResponse, linkedToQuoteResponse

    ###############################################################################################
    # Function process outbound custom object mappings (CPQ -> Salesforce)
    ###############################################################################################
    def process_outbound_custom_object_mappings(self, bearerToken, event):
        class_custom_object_mapping = CL_CustomObjectMapping(self.Quote, None)
        mappings = filter(lambda x: x["Outbound"], class_custom_object_mapping.custom_object_mappings())
        Log.Info("mappings outbound----->"+str(mappings))
        if mappings:
            linkedToQuoteMappings = filter(lambda x: x["Linked_To_Quote"], mappings)
            #Log.Info("linkedToQuoteMappings----->"+str(linkedToQuoteMappings))
            if linkedToQuoteMappings:
                self.create_update_linked_to_quote_obj(bearerToken, linkedToQuoteMappings, event)
            queryMappings = filter(lambda x: x["Query"] != "" and x["Linked_To_Quote"] is False, mappings)
            if queryMappings:
                self.create_update_query_custom_obj(bearerToken, queryMappings, event)

    ###############################################################################################
    # Function to create/update custom object (CPQ -> Salesforce)
    ###############################################################################################
    def create_update_query_custom_obj(self, bearerToken, mappings, event):
        response = None
        # Get Custom Object Ids
        response = self.get_query_custom_object_ids(bearerToken, mappings)
        if response:
            if response["compositeResponse"]:
                compositePayload = list()
                for mapping in mappings:
                    # Get Custom Object response
                    Log.Info("create_update_query_custom_obj mapping---->"+str(mapping))
                    customObjectResponse = next((resp for resp in response["compositeResponse"] if resp["referenceId"] == mapping["Name"] and resp["body"]["totalSize"] > 0), None)
                    customObjectId = str()
                    if customObjectResponse:
                        # Get Custom Object Id
                        customObjectRecord = next((rec for rec in customObjectResponse["body"]["records"]), None)
                        if customObjectRecord:
                            for attr in customObjectRecord:
                                if attr.Name != "attributes":
                                    customObjectId = str(getattr(customObjectRecord, attr.Name))
                                    break
                    # Build Create/Update Custom Object Composite Request
                    compositeRequest = self.build_cr_create_update_custom_object(mapping, customObjectId, event, mapping["Create"])
                    Log.Info("outbound compositeRequest--222---->"+str(compositeRequest))
                    if compositeRequest:
                        compositePayload.append(compositeRequest)
                        Log.Info("outbound compositePayload--222---->"+str(compositePayload))
                if compositePayload:
                    # Call REST API
                    response = self.post_composite_request(bearerToken, compositePayload, INT_REF.REF_CR_UP_CUSTOM_OBJECTS)
                    Log.Info("outbound response--222---->"+str(response))
        return response

    ###############################################################################################
    # Function to create/update custom object Linked to Quote (CPQ -> Salesforce)
    ###############################################################################################
    def create_update_linked_to_quote_obj(self, bearerToken, mappings, event):
        response = None
        # Get Custom Object Id
        try:
            customObjectQuoteTable = self.Quote.QuoteTables["CPQ_SF_QUOTE_CUSTOM_OBJECTS"]
        except SystemError as e:
            Log.Error("CPQ-SFDC: Custom Object table not found", str(e))
            customObjectQuoteTable = None
        if customObjectQuoteTable:
            compositePayload = list()
            for mapping in mappings:
                customObject = next((row for row in customObjectQuoteTable.Rows if row.GetColumnValue("CUSTOM_OBJECT_NAME") == mapping["Name"]), None)
                #Log.Info("customObject QT------->"+str(customObject))
                customObjectId = None
                if customObject:
                    customObjectId = customObject.GetColumnValue("CUSTOM_OBJECT_ID")
                compositeRequest = self.build_cr_create_update_custom_object(mapping, customObjectId, event, mapping["Create"])
                #Log.Info("outbound compositeRequest--111---->"+str(compositeRequest))
                if compositeRequest:
                    compositePayload.append(compositeRequest)
                    #Log.Info("outbound compositePayload--111---->"+str(compositePayload))
            if compositePayload:
                # Call REST API
                #Log.Info("bearerToken-->{}--compositePayload---->{}---REF_CR_UP_CUSTOM_OBJECTS---->{}--->".format(str(bearerToken), str(compositePayload), str(INT_REF.REF_CR_UP_CUSTOM_OBJECTS)))
                response = self.post_composite_request(bearerToken, compositePayload, INT_REF.REF_CR_UP_CUSTOM_OBJECTS)
                #Log.Info("response---->"+str(response))
                # Add/Update to Quote Table
                if response:
                    #Log.Info("response---->"+str(response))
                    self.update_custom_object_quote_table(customObjectQuoteTable, mappings, response)
        return response

    ###############################################################################################
    # Function to update custom object Quote Table based on response
    ###############################################################################################
    def update_custom_object_quote_table(self, customObjectQuoteTable, mappings, response):
        for mapping in mappings:
            customObjectResp = next((resp for resp in response["compositeResponse"]
                                     if resp["referenceId"] == mapping["Name"]
                                     and resp["httpStatusCode"] == 201), None)
            if customObjectResp:
                # Get Custom Object Id
                customObjectId = str(customObjectResp["body"]["id"])
                if customObjectId != "":
                    customObject = next((row for row in customObjectQuoteTable.Rows if row.GetColumnValue("CUSTOM_OBJECT_NAME") == mapping["Name"]), None)
                    # Update row
                    if customObject:
                        customObject.SetColumnValue("CUSTOM_OBJECT_ID", customObjectId)
                    # Add row
                    else:
                        newRow = customObjectQuoteTable.AddNewRow()
                        newRow.SetColumnValue("CUSTOM_OBJECT_NAME", mapping["Name"])
                        newRow.SetColumnValue("CUSTOM_OBJECT_ID", customObjectId)

    ###############################################################################################
    # Function to get composite request to create/update Custom Object
    ###############################################################################################
    def build_cr_create_update_custom_object(self, mapping, customObjectId, event, createFlag):
        compositeRequest = None
        customObjectRecord = dict()
        class_custom_object_mapping = CL_CustomObjectMapping(self.Quote, None)
        if event == EVENT_CREATE:
            customObjectRecord = class_custom_object_mapping.on_opp_create_custom_object_mapping(self.Quote, mapping["Name"])
        elif event == EVENT_UPDATE:
            customObjectRecord = class_custom_object_mapping.on_opp_update_custom_object_mapping(self.Quote, mapping["Name"])
        customObjectRecord.update(class_custom_object_mapping.on_opp_createupdate_custom_object_mapping(self.Quote, mapping["Name"]))
        Log.Info("build_cr_create_update_custom_object--->"+str(customObjectRecord))

        if customObjectRecord:
            url = str()
            method = str()
            if customObjectId:
                # Update
                #Log.Info("customObjectId----->")
                url = API.GET_SOBJECT_API.format(sObject=str(mapping["Type"]), sObjectId=str(customObjectId))
                method = API.PATCH
            else:
                # Create
                #Log.Info("createFlag----->"+str(createFlag))
                if createFlag:
                    url = API.SOBJECT_API.format(sObject=str(mapping["Type"]))
                    method = API.POST
            if url and method:
                compositeRequest = self.build_cr_sobject_request(url, method, None, mapping["Name"])
                compositeRequest["body"] = customObjectRecord

        return compositeRequest