<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Register.aspx.cs" Inherits="NXLevel.LMS.Register" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/css/select2.min.css" rel="stylesheet" /> 
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/js/select2.min.js"></script>
    <script>
        $(document).ready(function () {
            $('#ddOrganization').select2(); //setup org search
        });
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <div class="page-header">
        <h3><span class="glyphicon glyphicon-saved"></span> <%= GetLocalResourceObject("PageTitle")%></h3>
    </div>

    <div class="row" style="background-color: #f1f7fd; border-radius: 10px; margin: 0px">
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
        <div class="col-md-5">

            <p>&nbsp;</p>
            <asp:Label ID="ErrorMsg" runat="server" CssClass="required-red" Text="" />
            <p><%= GetLocalResourceObject("Text1")%></p>

            <label for="txtFName"><%= GetLocalResourceObject("LabelFirstName")%></label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="RequiredFName" runat="server" ErrorMessage="<%$ Resources: ReqFirstName %>" ControlToValidate="txtFName" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox name="txtFName" size="19" ID="txtFName" runat="server" CssClass="form-control" required autofocus ></asp:TextBox><br />

            <label for="txtLName"><%= GetLocalResourceObject("LabelLastName")%></label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="<%$ Resources: ReqLastName %>" ControlToValidate="txtLName" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox name="txtLName" size="19" ID="txtLName" runat="server" CssClass="form-control" required ></asp:TextBox><br />

            <label for="txtNewEmail"><%= GetLocalResourceObject("LabelEmail")%></label> <div class="asterisk required-red"></div>
            <asp:RegularExpressionValidator ID="validateEmail"    
                  runat="server" ErrorMessage="<%$ Resources: ReqValidEmail %>"
                  ControlToValidate="txtNewEmail" 
                  ValidationExpression="^([\w\.\-]+)@([\w\-]+)((\.(\w){2,4})+)$"
                  Display="Dynamic" CssClass="required-red"/>
            <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ErrorMessage="<%$ Resources: ReqEmail %>" ControlToValidate="txtNewEmail" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox size="19" ID="txtNewEmail" runat="server" ClientIDMode="Static" CssClass="form-control" autocomplete="off" AutoCompleteType="Disabled" required ViewStateMode="Enabled"></asp:TextBox><br />

            <label for="txtTitle"><%= GetLocalResourceObject("LabelTitle")%></label>  
            <asp:TextBox name="txtTitle" size="19" ID="txtTitle" runat="server" CssClass="form-control" ></asp:TextBox><br />

            <%--<label for="txtPwd1"><%= GetLocalResourceObject("LabelPwd")%></label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" ErrorMessage="<%$ Resources: ReqPwd %>" ControlToValidate="txtPwd1" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:RegularExpressionValidator ID="RegExp1" runat="server"    
                ErrorMessage="<%$ Resources: ReqInvalidPwd %>"
                ControlToValidate="txtPwd1"    
                ValidationExpression="^[a-zA-Z0-9'@&#.\s]{7,200}$"
                Display="Dynamic" CssClass="required-red" />
            <asp:TextBox name="txtPwd1" size="19" ID="txtPwd1" runat="server" CssClass="form-control" ClientIDMode="Static" TextMode="Password" AutoCompleteType="None" autocomplete="new-password" required ></asp:TextBox>
            <span id="passwordToggle" class="fa fa-eye password-toggle" aria-hidden="true"></span><br />--%>
<%--            <label for="txtPwd2">Retype Password:</label> <div class="asterisk required-red"></div>
            <asp:TextBox name="txtPwd2" size="19" ID="txtPwd2" runat="server" CssClass="form-control" TextMode="Password" required></asp:TextBox><br />--%>

            <label for="txtRegisterCode"><%= GetLocalResourceObject("LabelRegCode")%></label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="rfvRegistrationCode" runat="server" ErrorMessage="<%$ Resources: ReqRegCode %>" ControlToValidate="txtRegisterCode" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox name="txtRegisterCode" size="19" ID="txtRegisterCode" runat="server" CssClass="form-control" required ></asp:TextBox>
            <br />

            <label for="txtAccessCode"><%= GetLocalResourceObject("LabelOrganization")%></label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="rfvOrganization" runat="server" ErrorMessage="<%$ Resources: ReqOrganization %>" ControlToValidate="ddOrganization" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <%--<asp:TextBox name="txtCompanyCode" size="19" ID="txtCompanyCode" runat="server" CssClass="form-control" required ></asp:TextBox>--%>
            <asp:DropDownList runat="server" ID="ddOrganization" ClientIDMode="Static" CssClass="form-control">
                <asp:ListItem Text="Select organization" Value=""></asp:ListItem>
                <asp:ListItem Text="ABELSON TAYLOR INC" Value="ABELSON TAYLOR INC"></asp:ListItem>
                <asp:ListItem Text="ACCESS COMMUNICATIONS LLC" Value="ACCESS COMMUNICATIONS LLC"></asp:ListItem>
                <asp:ListItem Text="Accionar" Value="Accionar"></asp:ListItem>
                <asp:ListItem Text="ACSEL HEALTH LLC" Value="ACSEL HEALTH LLC"></asp:ListItem>
                <asp:ListItem Text="ADVANCED HEALTH MEDIA LLC (AHM)" Value="ADVANCED HEALTH MEDIA LLC (AHM)"></asp:ListItem>
                <asp:ListItem Text="AHM Direct" Value="AHM Direct"></asp:ListItem>
                <asp:ListItem Text="ALBANY MOLECULAR RESEARCH INC" Value="ALBANY MOLECULAR RESEARCH INC"></asp:ListItem>
                <asp:ListItem Text="ALLCELLS LLC" Value="ALLCELLS LLC"></asp:ListItem>
                <asp:ListItem Text="ALMAC CLINICAL SERVICES" Value="ALMAC CLINICAL SERVICES"></asp:ListItem>
                <asp:ListItem Text="ANAPLAN INC" Value="ANAPLAN INC"></asp:ListItem>
                <asp:ListItem Text="AnswerLab" Value="AnswerLab"></asp:ListItem>
                <asp:ListItem Text="APOGENICS INC" Value="APOGENICS INC"></asp:ListItem>
                <asp:ListItem Text="Aptis Partners" Value="Aptis Partners"></asp:ListItem>
                <asp:ListItem Text="Aptus Health (PHYSICIANS INTERACTIVE)" Value="Aptus Health (PHYSICIANS INTERACTIVE)"></asp:ListItem>
                <asp:ListItem Text="ARBOUR GROUP LLC" Value="ARBOUR GROUP LLC"></asp:ListItem>
                <asp:ListItem Text="ARCHES Technology also d/b/a DKI" Value="ARCHES Technology also d/b/a DKI"></asp:ListItem>
                <asp:ListItem Text="ARCHI TECH SYSTEMS INC" Value="ARCHI TECH SYSTEMS INC"></asp:ListItem>
                <asp:ListItem Text="Area 23" Value="Area 23"></asp:ListItem>
                <asp:ListItem Text="Artsci Health" Value="Artsci Health"></asp:ListItem>
                <asp:ListItem Text="Asembia" Value="Asembia"></asp:ListItem>
                <asp:ListItem Text="Ashfield Healthcare" Value="Ashfield Healthcare"></asp:ListItem>
                <asp:ListItem Text="ASYMCHEM INC" Value="ASYMCHEM INC"></asp:ListItem>
                <asp:ListItem Text="AUGUST JACKSON COMPANY" Value="AUGUST JACKSON COMPANY"></asp:ListItem>
                <asp:ListItem Text="AVARA PHARMACEUTICAL TECHNOLOGIES" Value="AVARA PHARMACEUTICAL TECHNOLOGIES"></asp:ListItem>
                <asp:ListItem Text="AVI SYSTEMS INC" Value="AVI SYSTEMS INC"></asp:ListItem>
                <asp:ListItem Text="AXTRIA INC" Value="AXTRIA INC"></asp:ListItem>
                <asp:ListItem Text="BEGHOU CONSULTING INC" Value="BEGHOU CONSULTING INC"></asp:ListItem>
                <asp:ListItem Text="BEND RESEARCH INC" Value="BEND RESEARCH INC"></asp:ListItem>
                <asp:ListItem Text="BI A TRADE NAME OF SCHOENECKERS INC" Value="BI A TRADE NAME OF SCHOENECKERS INC"></asp:ListItem>
                <asp:ListItem Text="BI WORLDWIDE" Value="BI WORLDWIDE"></asp:ListItem>
                <asp:ListItem Text="BIO RAD LABORATORIES INC" Value="BIO RAD LABORATORIES INC"></asp:ListItem>
                <asp:ListItem Text="BIOPHARM COMMUNICATIONS LLC" Value="BIOPHARM COMMUNICATIONS LLC"></asp:ListItem>
                <asp:ListItem Text="BIOPOINT INC" Value="BIOPOINT INC"></asp:ListItem>
                <asp:ListItem Text="BIOSCRIPT STERLING LTD" Value="BIOSCRIPT STERLING LTD"></asp:ListItem>
                <asp:ListItem Text="BOSTON CONSULTING GROUP" Value="BOSTON CONSULTING GROUP"></asp:ListItem>
                <asp:ListItem Text="BRIZZEY LLC" Value="BRIZZEY LLC"></asp:ListItem>
                <asp:ListItem Text="BROAD STREET HEALTH ECONOMICS" Value="BROAD STREET HEALTH ECONOMICS"></asp:ListItem>
                <asp:ListItem Text="Brooks Group Inc" Value="Brooks Group Inc"></asp:ListItem>
                <asp:ListItem Text="BURSON MARSTELLER LLC" Value="BURSON MARSTELLER LLC"></asp:ListItem>
                <asp:ListItem Text="BUSINESSONE TECHNOLOGIES INC" Value="BUSINESSONE TECHNOLOGIES INC"></asp:ListItem>
                <asp:ListItem Text="C3I INC" Value="C3I INC"></asp:ListItem>
                <asp:ListItem Text="CAC AMERICA CORP" Value="CAC AMERICA CORP"></asp:ListItem>
                <asp:ListItem Text="CANCER GENETICS INC" Value="CANCER GENETICS INC"></asp:ListItem>
                <asp:ListItem Text="CAPGEMINI" Value="CAPGEMINI"></asp:ListItem>
                <asp:ListItem Text="CAPITAL RETURNS INC" Value="CAPITAL RETURNS INC"></asp:ListItem>
                <asp:ListItem Text="CARITAS CLINICAL CONSULTING LLC" Value="CARITAS CLINICAL CONSULTING LLC"></asp:ListItem>
                <asp:ListItem Text="CATALENT PHARMA SOLUTIONS" Value="CATALENT PHARMA SOLUTIONS"></asp:ListItem>
                <asp:ListItem Text="CDMICONNECT LLC" Value="CDMICONNECT LLC"></asp:ListItem>
                <asp:ListItem Text="CELL LINE GENETICS INC" Value="CELL LINE GENETICS INC"></asp:ListItem>
                <asp:ListItem Text="Cello MedErgy" Value="Cello MedErgy"></asp:ListItem>
                <asp:ListItem Text="CHOICE HEALTHCARE SOLUTIONS" Value="CHOICE HEALTHCARE SOLUTIONS"></asp:ListItem>
                <asp:ListItem Text="CISCO SYSTEMS" Value="CISCO SYSTEMS"></asp:ListItem>
                <asp:ListItem Text="CLARKSTON POTOMAC GROUP INC" Value="CLARKSTON POTOMAC GROUP INC"></asp:ListItem>
                <asp:ListItem Text="CLD Inc" Value="CLD Inc"></asp:ListItem>
                <asp:ListItem Text="CLEARVIEW HEALTHCARE PARTNERS LLC" Value="CLEARVIEW HEALTHCARE PARTNERS LLC"></asp:ListItem>
                <asp:ListItem Text="Closerlook Inc" Value="Closerlook Inc"></asp:ListItem>
                <asp:ListItem Text="CMI Media" Value="CMI Media"></asp:ListItem>
                <asp:ListItem Text="CMIC INC" Value="CMIC INC"></asp:ListItem>
                <asp:ListItem Text="COGNIZANT TECHNOLOGY SOLUTIONS" Value="COGNIZANT TECHNOLOGY SOLUTIONS"></asp:ListItem>
                <asp:ListItem Text="Communication Partners" Value="Communication Partners"></asp:ListItem>
                <asp:ListItem Text="COMPLETE HEALTHVIZION" Value="COMPLETE HEALTHVIZION"></asp:ListItem>
                <asp:ListItem Text="Compliance in Action, LLC" Value="Compliance in Action, LLC"></asp:ListItem>
                <asp:ListItem Text="COMPREHENSIVE HEALTH INSIGHTS INC" Value="COMPREHENSIVE HEALTH INSIGHTS INC"></asp:ListItem>
                <asp:ListItem Text="COMSCORE INC" Value="COMSCORE INC"></asp:ListItem>
                <asp:ListItem Text="CONCUR TECHNOLOGIES INC" Value="CONCUR TECHNOLOGIES INC"></asp:ListItem>
                <asp:ListItem Text="ConneXion360" Value="ConneXion360"></asp:ListItem>
                <asp:ListItem Text="COTTON CONSULTING LLC" Value="COTTON CONSULTING LLC"></asp:ListItem>
                <asp:ListItem Text="COVANCE MARKET ACCESS SERVICES INC" Value="COVANCE MARKET ACCESS SERVICES INC"></asp:ListItem>
                <asp:ListItem Text="COVINGTON AND BURLING" Value="COVINGTON AND BURLING"></asp:ListItem>
                <asp:ListItem Text="CREATIVE PROMOTIONAL PRODUCTS" Value="CREATIVE PROMOTIONAL PRODUCTS"></asp:ListItem>
                <asp:ListItem Text="CROSSMARK GRAPHICS" Value="CROSSMARK GRAPHICS"></asp:ListItem>
                <asp:ListItem Text="Curtis Learning" Value="Curtis Learning"></asp:ListItem>
                <asp:ListItem Text="CUSTOM LEARNING DESIGNS INC" Value="CUSTOM LEARNING DESIGNS INC"></asp:ListItem>
                <asp:ListItem Text="D S  HOWARD AND ASSOCIATES" Value="D S  HOWARD AND ASSOCIATES"></asp:ListItem>
                <asp:ListItem Text="DANIEL J EDELMAN INC" Value="DANIEL J EDELMAN INC"></asp:ListItem>
                <asp:ListItem Text="DANIELS GROUP OF COMPANIES (M&I)" Value="DANIELS GROUP OF COMPANIES (M&I)"></asp:ListItem>
                <asp:ListItem Text="DATA DESIGN CONSULTING INC" Value="DATA DESIGN CONSULTING INC"></asp:ListItem>
                <asp:ListItem Text="DATAPIPE INC" Value="DATAPIPE INC"></asp:ListItem>
                <asp:ListItem Text="DBC PRI-MED LLC" Value="DBC PRI-MED LLC"></asp:ListItem>
                <asp:ListItem Text="DEALLUS INC" Value="DEALLUS INC"></asp:ListItem>
                <asp:ListItem Text="Defined Health" Value="Defined Health"></asp:ListItem>
                <asp:ListItem Text="DELOITTE" Value="DELOITTE"></asp:ListItem>
                <asp:ListItem Text="DIACEUTICS LTD" Value="DIACEUTICS LTD"></asp:ListItem>
                <asp:ListItem Text="DIAMOND MARKETING SOLUTIONS" Value="DIAMOND MARKETING SOLUTIONS"></asp:ListItem>
                <asp:ListItem Text="DISCOVERY USA" Value="DISCOVERY USA"></asp:ListItem>
                <asp:ListItem Text="DR/DECISION RESOURCES LLC" Value="DR/DECISION RESOURCES LLC"></asp:ListItem>
                <asp:ListItem Text="E Squared Communications LLC" Value="E Squared Communications LLC"></asp:ListItem>
                <asp:ListItem Text="Educational Resource" Value="Educational Resource"></asp:ListItem>
                <asp:ListItem Text="EDWARD S TRIPP AND ASSOCIATES INC" Value="EDWARD S TRIPP AND ASSOCIATES INC"></asp:ListItem>
                <asp:ListItem Text="EGON ZEHNDER INC" Value="EGON ZEHNDER INC"></asp:ListItem>
                <asp:ListItem Text="ELEMENT FLEET MANAGEMENT" Value="ELEMENT FLEET MANAGEMENT"></asp:ListItem>
                <asp:ListItem Text="ENVISION PHARMA" Value="ENVISION PHARMA"></asp:ListItem>
                <asp:ListItem Text="EVOC INSIGHTS LLC" Value="EVOC INSIGHTS LLC"></asp:ListItem>
                <asp:ListItem Text="Evolution Consulting" Value="Evolution Consulting"></asp:ListItem>
                <asp:ListItem Text="EXECUTIVE COACHING CONNECTIONS" Value="EXECUTIVE COACHING CONNECTIONS"></asp:ListItem>
                <asp:ListItem Text="EXHIBITUS INC" Value="EXHIBITUS INC"></asp:ListItem>
                <asp:ListItem Text="FAST SWITCH LTD" Value="FAST SWITCH LTD"></asp:ListItem>
                <asp:ListItem Text="FCB WORLDWIDE INC" Value="FCB WORLDWIDE INC"></asp:ListItem>
                <asp:ListItem Text="FLASHPOINT MEDICA LLC" Value="FLASHPOINT MEDICA LLC"></asp:ListItem>
                <asp:ListItem Text="GCI Health" Value="GCI Health"></asp:ListItem>
                <asp:ListItem Text="GERSON LEHRMAN GROUP INC" Value="GERSON LEHRMAN GROUP INC"></asp:ListItem>
                <asp:ListItem Text="GfK Market Access" Value="GfK Market Access"></asp:ListItem>
                <asp:ListItem Text="GHG Greyhealth Group" Value="GHG Greyhealth Group"></asp:ListItem>
                <asp:ListItem Text="GOLINHARRIS INTERNATIONAL" Value="GOLINHARRIS INTERNATIONAL"></asp:ListItem>
                <asp:ListItem Text="GRIP LIMITED" Value="GRIP LIMITED"></asp:ListItem>
                <asp:ListItem Text="HAAPANEN BROTHERS" Value="HAAPANEN BROTHERS"></asp:ListItem>
                <asp:ListItem Text="HAVAS HEALTH INC" Value="HAVAS HEALTH INC"></asp:ListItem>
                <asp:ListItem Text="HAWKPARTNERS LLC" Value="HAWKPARTNERS LLC"></asp:ListItem>
                <asp:ListItem Text="HEALTH & WELLNESS PARTNERS" Value="HEALTH & WELLNESS PARTNERS"></asp:ListItem>
                <asp:ListItem Text="Health 4 Brands" Value="Health 4 Brands"></asp:ListItem>
                <asp:ListItem Text="Health Advocacy Strategies, LLC" Value="Health Advocacy Strategies, LLC"></asp:ListItem>
                <asp:ListItem Text="Health and Welness Partners" Value="Health and Welness Partners"></asp:ListItem>
                <asp:ListItem Text="HEALTH INDUSTRIES RESEARCH" Value="HEALTH INDUSTRIES RESEARCH"></asp:ListItem>
                <asp:ListItem Text="HEALTH MARKET SCIENCE INC" Value="HEALTH MARKET SCIENCE INC"></asp:ListItem>
                <asp:ListItem Text="HEALTH STRATEGIES GROUP INC" Value="HEALTH STRATEGIES GROUP INC"></asp:ListItem>
                <asp:ListItem Text="Healthcare Business Insights" Value="Healthcare Business Insights"></asp:ListItem>
                <asp:ListItem Text="Healthcare Research Worldwide Inc" Value="Healthcare Research Worldwide Inc"></asp:ListItem>
                <asp:ListItem Text="HITACHI CONSULTING CORP" Value="HITACHI CONSULTING CORP"></asp:ListItem>
                <asp:ListItem Text="HOFFMAN TECHNOLOGIES INC" Value="HOFFMAN TECHNOLOGIES INC"></asp:ListItem>
                <asp:ListItem Text="HOSPIRA WORLDWIDE INC" Value="HOSPIRA WORLDWIDE INC"></asp:ListItem>
                <asp:ListItem Text="HOVIONE LLC" Value="HOVIONE LLC"></asp:ListItem>
                <asp:ListItem Text="HP Group LLC" Value="HP Group LLC"></asp:ListItem>
                <asp:ListItem Text="HRW Healthcare" Value="HRW Healthcare"></asp:ListItem>
                <asp:ListItem Text="Hudson Global" Value="Hudson Global"></asp:ListItem>
                <asp:ListItem Text="HUMANZYME INC" Value="HUMANZYME INC"></asp:ListItem>
                <asp:ListItem Text="HURON CONSULTING GROUP INC" Value="HURON CONSULTING GROUP INC"></asp:ListItem>
                <asp:ListItem Text="IBM CORPORATION" Value="IBM CORPORATION"></asp:ListItem>
                <asp:ListItem Text="ICON CLINICAL RESEARCH" Value="ICON CLINICAL RESEARCH"></asp:ListItem>
                <asp:ListItem Text="IDEM TRANSLATIONS INC" Value="IDEM TRANSLATIONS INC"></asp:ListItem>
                <asp:ListItem Text="Illuminate" Value="Illuminate"></asp:ListItem>
                <asp:ListItem Text="Impact Communication Partners" Value="Impact Communication Partners"></asp:ListItem>
                <asp:ListItem Text="IMV" Value="IMV"></asp:ListItem>
                <asp:ListItem Text="INCITE MARKETING PLANNING" Value="INCITE MARKETING PLANNING"></asp:ListItem>
                <asp:ListItem Text="Informa Training Partners" Value="Informa Training Partners"></asp:ListItem>
                <asp:ListItem Text="INSIGHT DIRECT USA INC" Value="INSIGHT DIRECT USA INC"></asp:ListItem>
                <asp:ListItem Text="INSIGHT STRATEGY ADVISORS LLC" Value="INSIGHT STRATEGY ADVISORS LLC"></asp:ListItem>
                <asp:ListItem Text="Intramed Group" Value="Intramed Group"></asp:ListItem>
                <asp:ListItem Text="IPMC INC" Value="IPMC INC"></asp:ListItem>
                <asp:ListItem Text="IPSOS AMERICA INC" Value="IPSOS AMERICA INC"></asp:ListItem>
                <asp:ListItem Text="IQVIA (Former IMS)" Value="IQVIA (Former IMS)"></asp:ListItem>
                <asp:ListItem Text="IS HEALTHCARE DYNAMICS LTD" Value="IS HEALTHCARE DYNAMICS LTD"></asp:ListItem>
                <asp:ListItem Text="JONES DAY" Value="JONES DAY"></asp:ListItem>
                <asp:ListItem Text="JUICE Pharma Worldwide" Value="JUICE Pharma Worldwide"></asp:ListItem>
                <asp:ListItem Text="KANTAR HEALTH INC" Value="KANTAR HEALTH INC"></asp:ListItem>
                <asp:ListItem Text="Katalyst Advantage" Value="Katalyst Advantage"></asp:ListItem>
                <asp:ListItem Text="Kindle Communications" Value="Kindle Communications"></asp:ListItem>
                <asp:ListItem Text="KLICK INC" Value="KLICK INC"></asp:ListItem>
                <asp:ListItem Text="KORN FERRY INTERNATIONAL" Value="KORN FERRY INTERNATIONAL"></asp:ListItem>
                <asp:ListItem Text="KOTTER INTERNATIONAL INC" Value="KOTTER INTERNATIONAL INC"></asp:ListItem>
                <asp:ListItem Text="KPMG LLP" Value="KPMG LLP"></asp:ListItem>
                <asp:ListItem Text="LABCONNECT LLC" Value="LABCONNECT LLC"></asp:ListItem>
                <asp:ListItem Text="LEARNING PARADIGMS INC" Value="LEARNING PARADIGMS INC"></asp:ListItem>
                <asp:ListItem Text="LEK CONSULTING LLC" Value="LEK CONSULTING LLC"></asp:ListItem>
                <asp:ListItem Text="LESLIE C BENNING" Value="LESLIE C BENNING"></asp:ListItem>
                <asp:ListItem Text="LLORENTE AND CUENCA MIAMI LLC" Value="LLORENTE AND CUENCA MIAMI LLC"></asp:ListItem>
                <asp:ListItem Text="MARC INC" Value="MARC INC"></asp:ListItem>
                <asp:ListItem Text="MarketVision Research" Value="MarketVision Research"></asp:ListItem>
                <asp:ListItem Text="MARSH" Value="MARSH"></asp:ListItem>
                <asp:ListItem Text="MATREX EXHIBITS INC" Value="MATREX EXHIBITS INC"></asp:ListItem>
                <asp:ListItem Text="MB REAL ESTATE" Value="MB REAL ESTATE"></asp:ListItem>
                <asp:ListItem Text="MCKESSON DRUG COMPANY" Value="MCKESSON DRUG COMPANY"></asp:ListItem>
                <asp:ListItem Text="MED COMMUNICATIONS INC" Value="MED COMMUNICATIONS INC"></asp:ListItem>
                <asp:ListItem Text="MEDAXIOM LLC" Value="MEDAXIOM LLC"></asp:ListItem>
                <asp:ListItem Text="Medivation" Value="Medivation"></asp:ListItem>
                <asp:ListItem Text="META PHARMACEUTICAL SERVICES LLC" Value="META PHARMACEUTICAL SERVICES LLC"></asp:ListItem>
                <asp:ListItem Text="MILLENNIUM MEDICAL EDUCATION" Value="MILLENNIUM MEDICAL EDUCATION"></asp:ListItem>
                <asp:ListItem Text="MILTENYI BIOTEC INCORPORATED" Value="MILTENYI BIOTEC INCORPORATED"></asp:ListItem>
                <asp:ListItem Text="MINDFROG LLC" Value="MINDFROG LLC"></asp:ListItem>
                <asp:ListItem Text="MODEL N INC" Value="MODEL N INC"></asp:ListItem>
                <asp:ListItem Text="MRESULT CORP" Value="MRESULT CORP"></asp:ListItem>
                <asp:ListItem Text="MSLGROUP.COM" Value="MSLGROUP.COM"></asp:ListItem>
                <asp:ListItem Text="MVC ASSOCIATES" Value="MVC ASSOCIATES"></asp:ListItem>
                <asp:ListItem Text="Navigant" Value="Navigant"></asp:ListItem>
                <asp:ListItem Text="NDC HEALTH CORP (RELAYHEALTH)" Value="NDC HEALTH CORP (RELAYHEALTH)"></asp:ListItem>
                <asp:ListItem Text="NIKON INSTRUMENTS INC" Value="NIKON INSTRUMENTS INC"></asp:ListItem>
                <asp:ListItem Text="OMD USA LLC (Pathway (OMG)" Value="OMD USA LLC (Pathway (OMG)"></asp:ListItem>
                <asp:ListItem Text="One Research/Paul Nisbet" Value="One Research/Paul Nisbet"></asp:ListItem>
                <asp:ListItem Text="ONE SMOOTH STONE INC" Value="ONE SMOOTH STONE INC"></asp:ListItem>
                <asp:ListItem Text="Open Health Group" Value="Open Health Group"></asp:ListItem>
                <asp:ListItem Text="OPTIMIZERX CORPORATION" Value="OPTIMIZERX CORPORATION"></asp:ListItem>
                <asp:ListItem Text="OUTCOME SCIENCES INC" Value="OUTCOME SCIENCES INC"></asp:ListItem>
                <asp:ListItem Text="PACIFIC RIM MECHANICAL" Value="PACIFIC RIM MECHANICAL"></asp:ListItem>
                <asp:ListItem Text="PACKAGING COORDINATORS INC" Value="PACKAGING COORDINATORS INC"></asp:ListItem>
                <asp:ListItem Text="Paradigm LTC" Value="Paradigm LTC"></asp:ListItem>
                <asp:ListItem Text="PATHEON INC" Value="PATHEON INC"></asp:ListItem>
                <asp:ListItem Text="PATIENTS AND PURPOSE LLC" Value="PATIENTS AND PURPOSE LLC"></asp:ListItem>
                <asp:ListItem Text="PENN QUARTER PARTNERS LLC" Value="PENN QUARTER PARTNERS LLC"></asp:ListItem>
                <asp:ListItem Text="PERCIPIENT LLC" Value="PERCIPIENT LLC"></asp:ListItem>
                <asp:ListItem Text="Pfizer (Medivation)" Value="Pfizer (Medivation)"></asp:ListItem>
                <asp:ListItem Text="Pharma Care Strategies" Value="Pharma Care Strategies"></asp:ListItem>
                <asp:ListItem Text="PHYSICIANS INTERACTIVE (APTUS)" Value="PHYSICIANS INTERACTIVE (APTUS)"></asp:ListItem>
                <asp:ListItem Text="PLANET PHARMA LLC" Value="PLANET PHARMA LLC"></asp:ListItem>
                <asp:ListItem Text="PLANISWARE USA INC" Value="PLANISWARE USA INC"></asp:ListItem>
                <asp:ListItem Text="POINT B" Value="POINT B"></asp:ListItem>
                <asp:ListItem Text="POLARIS MANAGEMENT PARTNERS" Value="POLARIS MANAGEMENT PARTNERS"></asp:ListItem>
                <asp:ListItem Text="PRAXIS LIFE SCIENCES LLC" Value="PRAXIS LIFE SCIENCES LLC"></asp:ListItem>
                <asp:ListItem Text="PRECISION FOR MEDICINE (formerly Hobart)" Value="PRECISION FOR MEDICINE (formerly Hobart)"></asp:ListItem>
                <asp:ListItem Text="PRECISION FOR VALUE LLC" Value="PRECISION FOR VALUE LLC"></asp:ListItem>
                <asp:ListItem Text="PRECISION POINT SPECIALTY LLC" Value="PRECISION POINT SPECIALTY LLC"></asp:ListItem>
                <asp:ListItem Text="PRICE WATERHOUSE COOPERS (PwC)" Value="PRICE WATERHOUSE COOPERS (PwC)"></asp:ListItem>
                <asp:ListItem Text="PRICESPECTIVE LLC" Value="PRICESPECTIVE LLC"></asp:ListItem>
                <asp:ListItem Text="PRO METRICS INC" Value="PRO METRICS INC"></asp:ListItem>
                <asp:ListItem Text="Proactive Worldwide" Value="Proactive Worldwide"></asp:ListItem>
                <asp:ListItem Text="ProHealth" Value="ProHealth"></asp:ListItem>
                <asp:ListItem Text="PROMEGA" Value="PROMEGA"></asp:ListItem>
                <asp:ListItem Text="PSKW LLC" Value="PSKW LLC"></asp:ListItem>
                <asp:ListItem Text="PUTNAM ASSOCIATES" Value="PUTNAM ASSOCIATES"></asp:ListItem>
                <asp:ListItem Text="Q PHARMA CORP" Value="Q PHARMA CORP"></asp:ListItem>
                <asp:ListItem Text="QLIKTECH INC" Value="QLIKTECH INC"></asp:ListItem>
                <asp:ListItem Text="Qualworld-Fieldteam" Value="Qualworld-Fieldteam"></asp:ListItem>
                <asp:ListItem Text="RABIN RESEARCH COMPANY" Value="RABIN RESEARCH COMPANY"></asp:ListItem>
                <asp:ListItem Text="RANDSTAD NORTH AMERICA" Value="RANDSTAD NORTH AMERICA"></asp:ListItem>
                <asp:ListItem Text="RAZORFISH HEALTH" Value="RAZORFISH HEALTH"></asp:ListItem>
                <asp:ListItem Text="Red Nucleus" Value="Red Nucleus"></asp:ListItem>
                <asp:ListItem Text="RELEVATE HEALTH GROUP" Value="RELEVATE HEALTH GROUP"></asp:ListItem>
                <asp:ListItem Text="Resolution Media" Value="Resolution Media"></asp:ListItem>
                <asp:ListItem Text="RTC Wunderman" Value="RTC Wunderman"></asp:ListItem>
                <asp:ListItem Text="S PHASE LLC" Value="S PHASE LLC"></asp:ListItem>
                <asp:ListItem Text="SAI-MED PARTNERS LLC" Value="SAI-MED PARTNERS LLC"></asp:ListItem>
                <asp:ListItem Text="SAPTOPIA CONSULTING LLC" Value="SAPTOPIA CONSULTING LLC"></asp:ListItem>
                <asp:ListItem Text="SCARSIN CORP" Value="SCARSIN CORP"></asp:ListItem>
                <asp:ListItem Text="SCROLLMOTION INC" Value="SCROLLMOTION INC"></asp:ListItem>
                <asp:ListItem Text="Seattle Genetics, Inc" Value="Seattle Genetics, Inc"></asp:ListItem>
                <asp:ListItem Text="Sedulo Group" Value="Sedulo Group"></asp:ListItem>
                <asp:ListItem Text="SEI" Value="SEI"></asp:ListItem>
                <asp:ListItem Text="Shannon McCahan Consulting" Value="Shannon McCahan Consulting"></asp:ListItem>
                <asp:ListItem Text="SHYFT (TPS or Trinity Pharma Solutions)" Value="SHYFT (TPS or Trinity Pharma Solutions)"></asp:ListItem>
                <asp:ListItem Text="SIR SPEEDY" Value="SIR SPEEDY"></asp:ListItem>
                <asp:ListItem Text="SLALOM LLC" Value="SLALOM LLC"></asp:ListItem>
                <asp:ListItem Text="SOURCE HEALTHCARE ANALYTICS INC" Value="SOURCE HEALTHCARE ANALYTICS INC"></asp:ListItem>
                <asp:ListItem Text="Spectrum Science" Value="Spectrum Science"></asp:ListItem>
                <asp:ListItem Text="SPECTRUM SCIENCE COMMUNICATIONS INC" Value="SPECTRUM SCIENCE COMMUNICATIONS INC"></asp:ListItem>
                <asp:ListItem Text="STEMCELL TECHNOLOGIES INC" Value="STEMCELL TECHNOLOGIES INC"></asp:ListItem>
                <asp:ListItem Text="STI TECHNOLOGIES LTD" Value="STI TECHNOLOGIES LTD"></asp:ListItem>
                <asp:ListItem Text="Stori Health" Value="Stori Health"></asp:ListItem>
                <asp:ListItem Text="SUDLER AND HENNESSEY" Value="SUDLER AND HENNESSEY"></asp:ListItem>
                <asp:ListItem Text="TACONIC BIOSCIENCES INC" Value="TACONIC BIOSCIENCES INC"></asp:ListItem>
                <asp:ListItem Text="TATA AMERICA INTERNATIONAL CORP" Value="TATA AMERICA INTERNATIONAL CORP"></asp:ListItem>
                <asp:ListItem Text="Team 9" Value="Team 9"></asp:ListItem>
                <asp:ListItem Text="TECHNOLOGY SERVICES GROUP" Value="TECHNOLOGY SERVICES GROUP"></asp:ListItem>
                <asp:ListItem Text="TERA ENTERPRISE" Value="TERA ENTERPRISE"></asp:ListItem>
                <asp:ListItem Text="TGAS ADVISORS LLC" Value="TGAS ADVISORS LLC"></asp:ListItem>
                <asp:ListItem Text="The Bloc" Value="The Bloc"></asp:ListItem>
                <asp:ListItem Text="The Brooks Group" Value="The Brooks Group"></asp:ListItem>
                <asp:ListItem Text="THE JACKSON LABORATORY" Value="THE JACKSON LABORATORY"></asp:ListItem>
                <asp:ListItem Text="THE K-GROUP INC" Value="THE K-GROUP INC"></asp:ListItem>
                <asp:ListItem Text="THE ROBBINS COMPANY" Value="THE ROBBINS COMPANY"></asp:ListItem>
                <asp:ListItem Text="TRANZACT TECHNOLOGIES INC" Value="TRANZACT TECHNOLOGIES INC"></asp:ListItem>
                <asp:ListItem Text="TRG BUILDERS LLC" Value="TRG BUILDERS LLC"></asp:ListItem>
                <asp:ListItem Text="TWELVE CONSULTING GROUP" Value="TWELVE CONSULTING GROUP"></asp:ListItem>
                <asp:ListItem Text="UNCLE BOBS MANAGEMENT LLC" Value="UNCLE BOBS MANAGEMENT LLC"></asp:ListItem>
                <asp:ListItem Text="VALUECENTRIC LLC" Value="VALUECENTRIC LLC"></asp:ListItem>
                <asp:ListItem Text="VANGUARD PHARMA ULC" Value="VANGUARD PHARMA ULC"></asp:ListItem>
                <asp:ListItem Text="VEEVA SYSTEMS INC" Value="VEEVA SYSTEMS INC"></asp:ListItem>
                <asp:ListItem Text="Vision 2 Voice" Value="Vision 2 Voice"></asp:ListItem>
                <asp:ListItem Text="VMHQ RESEARCH LLC" Value="VMHQ RESEARCH LLC"></asp:ListItem>
                <asp:ListItem Text="VMS Biomarketing" Value="VMS Biomarketing"></asp:ListItem>
                <asp:ListItem Text="VPMR LLC" Value="VPMR LLC"></asp:ListItem>
                <asp:ListItem Text="VWR INTERNATIONAL INC" Value="VWR INTERNATIONAL INC"></asp:ListItem>
                <asp:ListItem Text="W2O" Value="W2O"></asp:ListItem>
                <asp:ListItem Text="WATERS CORPORATION" Value="WATERS CORPORATION"></asp:ListItem>
                <asp:ListItem Text="WELLSPRING COMMUNICATIONS INC" Value="WELLSPRING COMMUNICATIONS INC"></asp:ListItem>
                <asp:ListItem Text="WILSON DOW GROUP INC" Value="WILSON DOW GROUP INC"></asp:ListItem>
                <asp:ListItem Text="Windrose Consulting Group" Value="Windrose Consulting Group"></asp:ListItem>
                <asp:ListItem Text="XCENDA LLC" Value="XCENDA LLC"></asp:ListItem>
                <asp:ListItem Text="Yama Group" Value="Yama Group"></asp:ListItem>
                <asp:ListItem Text="ZS ASSOCIATES INC" Value="ZS ASSOCIATES INC"></asp:ListItem>
            </asp:DropDownList>
            <br /><br /><br />

            <%--<label for="txtMgrEmail"><%= GetLocalResourceObject("LabelMngrEmail")%></label>  
            <asp:TextBox name="txtMgrEmail" size="19" ID="txtMgrEmail" runat="server" CssClass="form-control" ></asp:TextBox><br />--%>

            <asp:Button ID="btnSubmit" runat="server" CssClass="btn btn-primary form-control" Text="<%$ Resources: Global, BtnSubmit %>" OnClick="btnSubmit_Click" />

            <p>&nbsp;</p>
            <p><a href="Login.aspx"><%= Resources.Global.ReturnToLogin %></a></p>
        </div>
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
    </div>

    <p>&nbsp;</p>

</asp:Content>
