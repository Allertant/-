#include <iostream>

using namespace std;

#include <string.h>

#include <stdio.h>

#define False 0

#define True 1

int Max[100][100] = {0}; //各进程所需各类资源的最大需求

int Avaliable[100] = {0}; //系统可用资源

char name[100] = {0}; //资源的名称

int Allocation[100][100] = {0}; //系统已分配资源

int Need[100][100] = {0}; //还需要资源

int Request[100] = {0}; //请求资源向量

int temp[100] = {0}; //存放安全序列

int Work[100] = {0}; //存放系统可提供资源

int p[100] = {0};

int q[100][100] = {0};

int z[100][100] = {0};

int M = 100; //作业的最大数为100

int N = 100; //资源的最大数为100

int gg = 1;

void showdata() //显示资源矩阵

{

  int i, j;

  cout << endl << "此时刻的资源分配情况为：" << endl;

  cout << "             Max      Allocation     Need     Avaliable" << endl;

  cout << "进程名      ";

  for (j = 0; j < 4; j++) {

    for (i = 0; i < N; i++)

      cout << name[i] << " ";

    cout << "      ";
  }

  cout << endl;

  for (i = 0; i < M; i++) {

    cout << " " << i << "         ";

    for (j = 0; j < N; j++)

      cout << Max[i][j] << " ";

    cout << "      ";

    for (j = 0; j < N; j++)

      cout << Allocation[i][j] << " ";

    cout << "      ";

    for (j = 0; j < N; j++)

      cout << Need[i][j] << " ";

    if (i == 0) {

      cout << "      ";

      for (j = 0; j < N; j++)

        cout << Avaliable[j] << " "; //输出分配资源
    }

    cout << endl;
  }
}

int changdata(int i) //进行资源分配

{

  int j;

  for (j = 0; j < M; j++) { // p[j]=Avaliable[j];

    Avaliable[j] = Avaliable[j] - Request[j];

    // q[i][j]=Allocation[i][j];

    Allocation[i][j] = Allocation[i][j] + Request[j];

    // z[i][j]=Need[i][j];

    Need[i][j] = Need[i][j] - Request[j];
  }

  return 1;
}

int safe() //安全性算法

{

  int i, d, k = 0, m, h, s, apply, Finish[100] = {0};

  int j;

  int flag = 0;

  for (i = 0; i < N; i++)

    Work[i] = Avaliable[i];

  cout << endl << "  安全性检查  " << endl;

  cout << "             Work      Need     Allocation     Work+Allocation     "
          "Finish"
       << endl;

  cout << "进程名      ";

  for (h = 0; h < 4; h++) {

    for (s = 0; s < N; s++)

      cout << name[s] << " ";

    cout << "      ";
  }

  cout << endl;

  for (i = 0; i < M; i++) {

    apply = 0;

    for (j = 0; j < N; j++) {

      if (Finish[i] == False && Need[i][j] <= Work[j])

      {

        apply++;

        if (apply == N)

        {
          cout << " " << i << "         ";

          for (d = 0; d < N; d++)

            cout << Work[d] << " ";

          cout << "      ";

          for (d = 0; d < N; d++)

            cout << Need[i][d] << " ";

          cout << "      ";

          for (d = 0; d < N; d++)

            cout << Allocation[i][d] << " ";

          cout << "      ";

          for (m = 0; m < N; m++)

          {

            Work[m] = Work[m] + Allocation[i][m];

            cout << Work[m] << " ";

          } //变分配数

          Finish[i] = True;

          temp[k] = i;

          cout << "              ";

          cout << "true"
               << " ";

          cout << endl;

          i = -1;

          k++;

          flag++;
        }
      }
    }
  }

  for (i = 0; i < M; i++) {

    if (Finish[i] == False) {

      for (j = 0; j < N; j++) {

        Avaliable[j] = Avaliable[j] + Request[j];
        ;

        Allocation[i][j] = Allocation[i][j] - Request[j];
        ;

        Need[i][j] = Need[i][j] + Request[j];
      }

      cout << endl
           << "系统进入不安全状态！此时系统不分配资源！"
           << endl; //不成功系统不安全

      return 0;
    }
  }

  cout << endl << "此时系统是安全的!" << endl; //如果安全，输出成功

  cout << "安全序列为:";

  for (i = 0; i < M; i++) { //输出运行进程数组

    cout << temp[i];

    if (i < M - 1)
      cout << "->";
  }

  cout << endl;

  return 0;
}

void share() //利用银行家算法对申请资源对进行判定

{

  char ch;

  int i = 0, j = 0;

  ch = 'y';

  cout << endl << "请输入要求分配的资源进程号(0-" << M - 1 << "):";

  cin >> i; //输入须申请的资源号

  cout << endl << "请输入进程 " << i << " 申请的资源:" << endl;

  for (j = 0; j < N; j++)

  {

    cout << name[j] << ":";

    cin >> Request[j]; //输入需要申请的资源
  }

  for (j = 0; j < N; j++) {

    if (Request[j] > Need[i][j]) //判断申请是否大于需求，若大于则出错

    {

      cout << endl << "进程 " << i << "申请的资源大于它需要的资源";

      cout << " 分配不合理，不予分配！" << endl;

      ch = 'n';

      break;

    }

    else {

      if (Request[j] > Avaliable[j]) //判断申请是否大于当前资源，若大于则

      { //出错

        cout << endl << "进程" << i << "申请的资源大于系统现在可利用的资源";

        cout << " 分配出错，不予分配!" << endl;

        ch = 'n';

        break;
      }
    }
  }

  if (ch == 'y') {

    changdata(i); //根据进程需求量变换资源

    showdata(); //根据进程需求量显示变换后的资源

    safe(); //根据进程需求量进行银行家算法判断
  }
}

int main() //主函数

{

  int t = 1, i, j, number, choice, m, n, flag;

  char ming;

  cout << "*****************银行家算法的设计与实现*****************" << endl;

  cout << endl << "请首先输入系统可供资源种类的数量:";

  cin >> n;

  N = n;

  for (i = 0; i < n; i++)

  {

    cout << "资源" << i + 1 << "的名称:";

    cin >> ming;

    name[i] = ming;

    cout << "资源的数量:";

    cin >> number;

    Avaliable[i] = number;
  }

  cout << endl;

  cout << "请输入作业的数量:";

  cin >> m;

  M = m;

  cout << endl
       << "请输入各进程的最大需求量(" << m << "*" << n << "矩阵)[Max]:" << endl;

  for (i = 0; i < m; i++)

    for (j = 0; j < n; j++)

      cin >> Max[i][j];

  do {

    flag = 0;

    cout << endl
         << "请输入各进程已经申请的资源量(" << m << "*" << n
         << "矩阵)[Allocation]:" << endl;

    for (i = 0; i < m; i++)

      for (j = 0; j < n; j++) {

        cin >> Allocation[i][j];

        if (Allocation[i][j] > Max[i][j])

          flag = 1;

        Need[i][j] = Max[i][j] - Allocation[i][j];
      }

    if (flag)

      cout << endl << "申请的资源大于最大需求量，请重新输入!\n" << endl;

  }

  while (flag);

  showdata(); //显示各种资源

  safe(); //用银行家算法判定系统是否安全

  while (1) {

    if (t == 1) {

      cout << endl << "  利用银行家算法预分配资源   " << endl;

      share();

      t = 0;
    }

    else
      break;

    cout << endl << " 是否继续银行家算法？(按 1 键继续,按其它任意键退出):";

    cin >> t;

    cout << endl;
  }

  return 1;
}